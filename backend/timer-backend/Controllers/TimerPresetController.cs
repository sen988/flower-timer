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

            _context.Presets.Add(preset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPresets), new { id = preset.Id }, preset);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreset(int id)
        {
            var preset = await _context.Presets.FindAsync(id);
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
