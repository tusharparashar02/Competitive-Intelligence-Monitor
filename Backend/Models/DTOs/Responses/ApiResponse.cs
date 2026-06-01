namespace Backend.Models.DTOs.Responses;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = [];

    public static ApiResponse<T> Ok(T data, string message = "Success") =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string message) =>
        new() { Success = false, Message = message };

    public static ApiResponse<T> WithErrors(List<string> errors, string message = "Validation failed") =>
        new() { Success = false, Message = message, Errors = errors };
}
