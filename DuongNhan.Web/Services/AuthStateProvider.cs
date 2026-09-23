using System.Security.Claims;
using System.Security.Principal;
using System.Xml.Linq;
using Microsoft.AspNetCore.Components.Authorization;

namespace DuongNhan.Web.Services;

public sealed class AuthStateProvider : AuthenticationStateProvider
{
    private static readonly AuthenticationState Anonymous =
        new(new ClaimsPrincipal(new ClaimsIdentity()));

    private AuthenticationState _current = Anonymous;

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        return Task.FromResult(_current);
    }

    public void SetUser(string name, string email)
    {
        var identity = new ClaimsIdentity(
            [
               new Claim(ClaimTypes.Name, name),
               new Claim(ClaimTypes.Email, email)
            ],
            authenticationType: "duongnhan_client");

        _current = new AuthenticationState(new ClaimsPrincipal(identity));
        NotifyAuthChanged();
    }
    public void ClearUser()
    {
        _current = Anonymous;
        NotifyAuthChanged();
    }
public void NotifyAuthChanged()
        => NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
}
