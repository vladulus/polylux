using System.Globalization;
using System.Text;
using LibreHardwareMonitor.Hardware;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Polylux.SensorDaemon;

/// <summary>
/// Owns a <see cref="Computer"/> instance, polls hardware on a timer,
/// and builds the JSON tree that LHM's Remote Web Server would serve on
/// <c>/data.json</c>. Polylux's parser (<c>polylux/sensors/lhm.py</c>)
/// walks <c>Children</c> looking for nodes whose <c>SensorId</c>
/// contains <c>/fan/</c> or <c>/temperature/</c>; everything else is
/// emitted for parity but is currently ignored downstream.
/// </summary>
public sealed class SensorCollector : BackgroundService
{
    private readonly ILogger<SensorCollector> _log;
    private readonly Computer _computer;
    private readonly UpdateVisitor _visitor = new();
    private readonly TimeSpan _interval;
    private readonly object _treeLock = new();
    private byte[]? _cachedJson;

    public SensorCollector(ILogger<SensorCollector> log, DaemonOptions opts)
    {
        _log = log;
        _interval = TimeSpan.FromMilliseconds(opts.UpdateMs);
        _computer = new Computer
        {
            IsCpuEnabled = true,
            IsGpuEnabled = true,
            IsMotherboardEnabled = true,
            IsControllerEnabled = true,
            IsMemoryEnabled = true,
            IsStorageEnabled = false,
            IsNetworkEnabled = false,
            IsPsuEnabled = false,
            IsBatteryEnabled = false,
        };
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _computer.Open();
            _log.LogInformation("LHM Computer opened, {count} top-level hardware items", _computer.Hardware.Count);
        }
        catch (Exception ex)
        {
            _log.LogCritical(ex, "Failed to open LHM Computer — driver load or admin permission missing");
            throw;
        }

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                Refresh();
                try
                {
                    await Task.Delay(_interval, stoppingToken).ConfigureAwait(false);
                }
                catch (TaskCanceledException) { break; }
            }
        }
        finally
        {
            try { _computer.Close(); } catch (Exception ex) { _log.LogWarning(ex, "Computer.Close threw"); }
        }
    }

    /// <summary>Snapshot of the most recent JSON tree as UTF-8 bytes.</summary>
    public byte[] GetJsonBytes()
    {
        lock (_treeLock)
        {
            // First request can arrive before the timer fires once.
            return _cachedJson ??= BuildJsonBytes();
        }
    }

    /// <summary>
    /// Apply a fan-control request to a Control-type sensor identified
    /// by its LHM identifier (e.g. <c>/lpc/nct6798d/0/control/0</c>).
    /// Returns ``true`` on success, ``false`` if the sensor wasn't found
    /// or has no Control interface (i.e. read-only fan tachometer).
    /// </summary>
    public bool SetFanControl(string sensorId, string mode, float? value)
    {
        var sensor = FindSensorByIdentifier(sensorId);
        if (sensor?.Control is null)
        {
            _log.LogWarning("SetFanControl: sensor {id} not found or has no IControl", sensorId);
            return false;
        }
        try
        {
            switch (mode.ToLowerInvariant())
            {
                case "default":
                case "auto":
                    sensor.Control.SetDefault();
                    _log.LogInformation("Fan {id} → default (BIOS control)", sensorId);
                    return true;
                case "software":
                case "manual":
                    if (value is null) return false;
                    var clamped = Math.Clamp(value.Value, 0f, 100f);
                    sensor.Control.SetSoftware(clamped);
                    _log.LogInformation("Fan {id} → software {pct:0.0}%", sensorId, clamped);
                    return true;
                default:
                    return false;
            }
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "Fan {id} control failed", sensorId);
            return false;
        }
    }

    private ISensor? FindSensorByIdentifier(string sensorId)
    {
        foreach (var hw in _computer.Hardware)
        {
            var hit = FindIn(hw, sensorId);
            if (hit is not null) return hit;
        }
        return null;
    }

    private static ISensor? FindIn(IHardware hw, string sensorId)
    {
        foreach (var s in hw.Sensors)
        {
            if (s.Identifier.ToString() == sensorId) return s;
        }
        foreach (var sub in hw.SubHardware)
        {
            var hit = FindIn(sub, sensorId);
            if (hit is not null) return hit;
        }
        return null;
    }

    private void Refresh()
    {
        try
        {
            foreach (var hw in _computer.Hardware) hw.Accept(_visitor);
            var bytes = BuildJsonBytes();
            lock (_treeLock) _cachedJson = bytes;
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "Refresh tick failed");
        }
    }

    private byte[] BuildJsonBytes()
    {
        // Hand-rolled JSON: trivial enough to avoid pulling JsonSerializer
        // for a recursive tree of plain strings, and easier to match LHM's
        // exact whitespace/escaping if needed.
        var sb = new StringBuilder(8 * 1024);
        var id = 0;
        sb.Append("{\"id\":").Append(id++).Append(",\"Text\":\"Sensor\",\"Children\":[");

        var computerNodeId = id++;
        sb.Append("{\"id\":").Append(computerNodeId)
          .Append(",\"Text\":").Append(Json(Environment.MachineName))
          .Append(",\"Children\":[");

        var first = true;
        foreach (var hw in _computer.Hardware)
        {
            if (!first) sb.Append(',');
            first = false;
            WriteHardware(sb, hw, ref id);
        }

        sb.Append("]}");  // close PC node
        sb.Append("]}");  // close root
        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    private static void WriteHardware(StringBuilder sb, IHardware hw, ref int id)
    {
        sb.Append("{\"id\":").Append(id++)
          .Append(",\"Text\":").Append(Json(hw.Name))
          .Append(",\"Children\":[");

        // Group sensors by SensorType so the tree mirrors LHM's UI.
        var sensorsByType = hw.Sensors
            .GroupBy(s => s.SensorType)
            .OrderBy(g => (int)g.Key);

        var first = true;
        foreach (var group in sensorsByType)
        {
            if (!first) sb.Append(',');
            first = false;
            sb.Append("{\"id\":").Append(id++)
              .Append(",\"Text\":").Append(Json(SensorTypeLabel(group.Key)))
              .Append(",\"Children\":[");

            var sensorFirst = true;
            foreach (var s in group.OrderBy(s => s.Index))
            {
                if (!sensorFirst) sb.Append(',');
                sensorFirst = false;
                WriteSensor(sb, s, ref id);
            }
            sb.Append("]}");
        }

        // Sub-hardware (e.g. GPU memory under GPU node).
        foreach (var sub in hw.SubHardware)
        {
            if (!first) sb.Append(',');
            first = false;
            WriteHardware(sb, sub, ref id);
        }

        sb.Append("]}");
    }

    private static void WriteSensor(StringBuilder sb, ISensor s, ref int id)
    {
        var value = FormatValue(s.Value, s.SensorType);
        var min = FormatValue(s.Min, s.SensorType);
        var max = FormatValue(s.Max, s.SensorType);

        sb.Append("{\"id\":").Append(id++)
          .Append(",\"Text\":").Append(Json(s.Name))
          .Append(",\"Min\":").Append(Json(min))
          .Append(",\"Value\":").Append(Json(value))
          .Append(",\"Max\":").Append(Json(max))
          .Append(",\"SensorId\":").Append(Json(s.Identifier.ToString()))
          .Append(",\"Type\":").Append(Json(s.SensorType.ToString()))
          .Append(",\"Children\":[]}");
    }

    private static string FormatValue(float? value, SensorType type)
    {
        if (value is null || float.IsNaN(value.Value)) return "-";
        var v = value.Value;
        return type switch
        {
            SensorType.Voltage     => v.ToString("0.000", CultureInfo.InvariantCulture) + " V",
            SensorType.Current     => v.ToString("0.000", CultureInfo.InvariantCulture) + " A",
            SensorType.Clock       => v.ToString("0", CultureInfo.InvariantCulture) + " MHz",
            SensorType.Temperature => v.ToString("0.0", CultureInfo.InvariantCulture) + " °C",
            SensorType.Load        => v.ToString("0.0", CultureInfo.InvariantCulture) + " %",
            SensorType.Frequency   => v.ToString("0", CultureInfo.InvariantCulture) + " Hz",
            SensorType.Fan         => v.ToString("0", CultureInfo.InvariantCulture) + " RPM",
            SensorType.Flow        => v.ToString("0", CultureInfo.InvariantCulture) + " L/h",
            SensorType.Control     => v.ToString("0.0", CultureInfo.InvariantCulture) + " %",
            SensorType.Level       => v.ToString("0.0", CultureInfo.InvariantCulture) + " %",
            SensorType.Power       => v.ToString("0.0", CultureInfo.InvariantCulture) + " W",
            SensorType.Data        => v.ToString("0.0", CultureInfo.InvariantCulture) + " GB",
            SensorType.SmallData   => v.ToString("0", CultureInfo.InvariantCulture) + " MB",
            SensorType.Throughput  => v.ToString("0.0", CultureInfo.InvariantCulture) + " KB/s",
            SensorType.Factor      => v.ToString("0.000", CultureInfo.InvariantCulture),
            SensorType.TimeSpan    => TimeSpan.FromSeconds(v).ToString(),
            SensorType.Energy      => v.ToString("0", CultureInfo.InvariantCulture) + " mWh",
            SensorType.Noise       => v.ToString("0", CultureInfo.InvariantCulture) + " dBA",
            SensorType.Conductivity=> v.ToString("0.0", CultureInfo.InvariantCulture) + " µS/cm",
            SensorType.Humidity    => v.ToString("0.0", CultureInfo.InvariantCulture) + " %",
            _ => v.ToString(CultureInfo.InvariantCulture),
        };
    }

    private static string SensorTypeLabel(SensorType t) => t switch
    {
        SensorType.Voltage     => "Voltages",
        SensorType.Current     => "Currents",
        SensorType.Clock       => "Clocks",
        SensorType.Temperature => "Temperatures",
        SensorType.Load        => "Load",
        SensorType.Frequency   => "Frequencies",
        SensorType.Fan         => "Fans",
        SensorType.Flow        => "Flows",
        SensorType.Control     => "Controls",
        SensorType.Level       => "Levels",
        SensorType.Power       => "Powers",
        SensorType.Data        => "Data",
        SensorType.SmallData   => "Data",
        SensorType.Throughput  => "Throughput",
        _ => t.ToString(),
    };

    private static string Json(string? s)
    {
        if (s is null) return "null";
        var sb = new StringBuilder(s.Length + 2);
        sb.Append('"');
        foreach (var c in s)
        {
            switch (c)
            {
                case '"':  sb.Append("\\\""); break;
                case '\\': sb.Append("\\\\"); break;
                case '\b': sb.Append("\\b"); break;
                case '\f': sb.Append("\\f"); break;
                case '\n': sb.Append("\\n"); break;
                case '\r': sb.Append("\\r"); break;
                case '\t': sb.Append("\\t"); break;
                default:
                    if (c < 0x20) sb.Append("\\u").Append(((int)c).ToString("x4"));
                    else sb.Append(c);
                    break;
            }
        }
        sb.Append('"');
        return sb.ToString();
    }

    private sealed class UpdateVisitor : IVisitor
    {
        public void VisitComputer(IComputer computer) => computer.Traverse(this);
        public void VisitHardware(IHardware hardware)
        {
            hardware.Update();
            foreach (var sub in hardware.SubHardware) sub.Accept(this);
        }
        public void VisitSensor(ISensor sensor) { }
        public void VisitParameter(IParameter parameter) { }
    }
}
