namespace TimerBackend.Models
{
    public class TimerSession
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? PauseTime { get; set; }
        public TimeSpan Elapsed { get; set; }
        public bool IsRunning { get; set; }
    }
}