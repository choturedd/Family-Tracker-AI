using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/activity")]
public class ActivityController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EmailService _emailService;

    public ActivityController(AppDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
        // Notice: In a real app we would filter by logged-in user UserId, 
        // but the frontend doesn't send auth headers yet so we'll just return all for demo
        var activities = await _context.Activities
            .OrderByDescending(a => a.CreatedDate)
            .ToListAsync();
        
        return Ok(activities);
    }

    [HttpPost]
    public async Task<IActionResult> PostActivity(ActivityPayload request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == request.UserId);
        if (user == null) 
            return BadRequest("Invalid User ID. Please login.");

        var activity = new Activity
        {
            UserId = user.UserId,
            Description = request.Description ?? "No description",
            ImageUrl = request.ImageUrl ?? "",
            CreatedDate = DateTime.UtcNow
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();

        // Send Email Notification
        var subject = $"New Activity Posted by {user.Name}";
        var body = $"User: {user.Name} ({user.Email})\nDate: {activity.CreatedDate}\nDescription: {activity.Description}\nImage URL: {activity.ImageUrl}";
        
        try 
        {
            await _emailService.SendEmail(subject, body, new List<string> { "indraredd05@gmail.com" });
        }
        catch (Exception ex)
        {
            // Log but don't fail the request if email fails
            Console.WriteLine($"Failed to send email: {ex.Message}");
        }

        return Ok(new { message = "Activity created successfully", activityId = activity.ActivityId });
    }

    [HttpGet("rag-context")]
    public async Task<IActionResult> GetRagContext()
    {
        var activities = await _context.Activities
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedDate)
            .Select(a => new
            {
                date = a.CreatedDate.ToString("yyyy-MM-dd HH:mm:ss"),
                email = a.User.Email,
                name = a.User.Name,
                description = a.Description,
                imageUrl = a.ImageUrl
            })
            .ToListAsync();
            
        return Ok(activities);
    }
}
