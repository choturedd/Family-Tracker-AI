using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(SignupRequest request)
    {
        if (await _context.Users.AnyAsync(x => x.Email == request.Email))
            return BadRequest("Email already exists");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = request.Password, // Directly using password as hash matching existing behavior
            Role = request.Role ?? "Family Member"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user == null)
            return Unauthorized("Invalid Email");

        if (user.PasswordHash != request.Password)
            return Unauthorized("Invalid Password");

        return Ok(new
        {
            userId = user.UserId,
            name = user.Name,
            email = user.Email,
            role = user.Role
        });
    }
}