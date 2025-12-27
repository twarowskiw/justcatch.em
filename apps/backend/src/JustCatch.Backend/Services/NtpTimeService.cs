using JustCatch.Backend.Models;
using Yort.Ntp;

namespace JustCatch.Backend.Services;

public sealed class NtpTimeService : INtpTimeService
{
    public async Task<TimeResponse> GetTimeAsync(CancellationToken cancellationToken = default)
    {
        var ntpHost = Environment.GetEnvironmentVariable("NTP_HOST") ?? "time.google.com";

        try
        {
            var ntp = new NtpClient(ntpHost);
            var now = await ntp.RequestTimeAsync();

            DateTime utc;
            try
            {
                dynamic d = now;
                utc = ((DateTimeOffset)d.NtpTime).UtcDateTime;
            }
            catch
            {
                utc = DateTime.UtcNow;
            }

            return new TimeResponse(utc, ntpHost);
        }
        catch
        {
            return new TimeResponse(DateTime.UtcNow, ntpHost);
        }
    }
}
