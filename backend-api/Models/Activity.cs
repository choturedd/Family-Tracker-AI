public class Activity
{
    public int ActivityId { get; set; }
    public int UserId { get; set; }
    public string ImageUrl { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }

    public User User { get; set; }
}