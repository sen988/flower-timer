using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimerBackend.Data;
using TimerBackend.Models;

namespace TimerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimerPresetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TimerPresetController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimerPreset>>> GetPresets()
        {
            return await _context.Presets.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TimerPreset>> CreatePreset(TimerPreset preset)
        {
            if (preset.Minutes <= 0)
            {
                return BadRequest("Preset minutes must be greater than zero.");
            }

            //check for dupes
            var existingPreset = await _context.Presets
                .AnyAsync(p => p.Minutes == preset.Minutes);

            if (existingPreset)
            {
                return Conflict("Preset with this duration already exists.");
            }

            _context.Presets.Add(preset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPresets), new { id = preset.Id }, preset);
        }

        [HttpDelete("{minutes}")]
        public async Task<IActionResult> DeletePreset(int minutes)
        {
            var preset = await _context.Presets.FirstOrDefaultAsync(p => p.Minutes == minutes);
            if (preset == null)
            {
                return NotFound();
            }

            _context.Presets.Remove(preset);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
