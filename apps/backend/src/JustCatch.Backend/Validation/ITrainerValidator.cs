using JustCatch.Backend.Models;

namespace JustCatch.Backend.Services;

public interface ITrainerValidator
{
    Dictionary<string, string[]> Validate(TrainerRequest request);
}
