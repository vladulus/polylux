using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Polylux.SensorDaemon;

// Polylux Sensor Daemon — headless LibreHardwareMonitor wrapper.
//
//   PolyluxSensorDaemon.exe                          # console mode
//   PolyluxSensorDaemon.exe --port 8085              # custom port
//   PolyluxSensorDaemon.exe --bind 127.0.0.1         # custom bind addr
//   PolyluxSensorDaemon.exe --update-ms 1000         # poll interval
//
// When launched via Service Control Manager, the same exe is detected as
// a Windows service via AddWindowsService() — no separate code path.

var opts = DaemonOptions.Parse(args);

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton(opts);
builder.Services.AddSingleton<SensorCollector>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<SensorCollector>());
builder.Services.AddHostedService<HttpServer>();

builder.Services.AddWindowsService(svc =>
{
    svc.ServiceName = "PolyluxSensorDaemon";
});

builder.Logging.AddSimpleConsole(o =>
{
    o.SingleLine = true;
    o.TimestampFormat = "HH:mm:ss ";
});

var host = builder.Build();
await host.RunAsync();

namespace Polylux.SensorDaemon
{
    public sealed class DaemonOptions
    {
        public string Bind { get; init; } = "127.0.0.1";
        public int Port { get; init; } = 8085;
        public int UpdateMs { get; init; } = 1000;

        public static DaemonOptions Parse(string[] args)
        {
            var bind = "127.0.0.1";
            var port = 8085;
            var updateMs = 1000;

            for (var i = 0; i < args.Length; i++)
            {
                switch (args[i])
                {
                    case "--bind" when i + 1 < args.Length:
                        bind = args[++i]; break;
                    case "--port" when i + 1 < args.Length:
                        port = int.Parse(args[++i]); break;
                    case "--update-ms" when i + 1 < args.Length:
                        updateMs = int.Parse(args[++i]); break;
                }
            }
            return new DaemonOptions { Bind = bind, Port = port, UpdateMs = updateMs };
        }
    }
}
