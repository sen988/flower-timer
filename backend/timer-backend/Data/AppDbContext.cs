using Microsoft.EntityFrameworkCore;
using TimerBackend.Models;

namespace TimerBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<TimerSession> TimerSessions { get; set; }
        public DbSet<TimerPreset> Presets { get; set; }
    }
}