using System.Net;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Polylux.SensorDaemon;

/// <summary>
/// Tiny <see cref="HttpListener"/> wrapper that serves the
/// <see cref="SensorCollector"/>'s cached JSON tree on <c>/data.json</c>.
/// Bound to <c>127.0.0.1</c> only so no firewall rule or URL ACL is
/// required even when the process runs as LocalSystem.
/// </summary>
public sealed class HttpServer : BackgroundService
{
    private readonly ILogger<HttpServer> _log;
    private readonly SensorCollector _collector;
    private readonly DaemonOptions _opts;
    private readonly HttpListener _listener = new();

    public HttpServer(ILogger<HttpServer> log, SensorCollector collector, DaemonOptions opts)
    {
        _log = log;
        _collector = collector;
        _opts = opts;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var prefix = $"http://{_opts.Bind}:{_opts.Port}/";
        _listener.Prefixes.Add(prefix);
        _listener.Start();
        _log.LogInformation("HTTP listening on {prefix}data.json", prefix);

        stoppingToken.Register(() =>
        {
            try { _listener.Stop(); } catch { /* shutdown race */ }
        });

        while (!stoppingToken.IsCancellationRequested)
        {
            HttpListenerContext ctx;
            try
            {
                ctx = await _listener.GetContextAsync().ConfigureAwait(false);
            }
            catch (HttpListenerException) when (stoppingToken.IsCancellationRequested) { break; }
            catch (ObjectDisposedException) { break; }

            _ = Task.Run(() => HandleAsync(ctx), stoppingToken);
        }

        try { _listener.Close(); } catch { /* ignored */ }
    }

    private async Task HandleAsync(HttpListenerContext ctx)
    {
        try
        {
            var path = ctx.Request.Url?.AbsolutePath ?? "/";
            switch (path)
            {
                case "/data.json":
                {
                    var bytes = _collector.GetJsonBytes();
                    ctx.Response.ContentType = "application/json; charset=utf-8";
                    ctx.Response.StatusCode = 200;
                    ctx.Response.ContentLength64 = bytes.Length;
                    await ctx.Response.OutputStream.WriteAsync(bytes).ConfigureAwait(false);
                    break;
                }
                case "/health":
                {
                    var ok = "{\"ok\":true}"u8.ToArray();
                    ctx.Response.ContentType = "application/json";
                    ctx.Response.StatusCode = 200;
                    ctx.Response.ContentLength64 = ok.Length;
                    await ctx.Response.OutputStream.WriteAsync(ok).ConfigureAwait(false);
                    break;
                }
                default:
                    ctx.Response.StatusCode = 404;
                    break;
            }
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "Request handling failed");
            try { ctx.Response.StatusCode = 500; } catch { /* ignored */ }
        }
        finally
        {
            try { ctx.Response.OutputStream.Close(); } catch { /* ignored */ }
        }
    }
}
