using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public interface INtpTimeService
{
    Task<TimeResponse> GetTimeAsync(CancellationToken cancellationToken = default);
}
