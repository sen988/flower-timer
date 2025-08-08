namespace TimerBackend.Models
{
    public class TimerPreset
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int DurationMinutes { get; set; }
    }
}