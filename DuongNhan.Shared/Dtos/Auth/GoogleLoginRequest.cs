namespace DuongNhan.Shared.Dtos.Auth;

public sealed record GoogleLoginRequest(
    string IdToken,
    string? Email = null,
    string? DisplayName = null,
    string? PictureUrl = null
);
