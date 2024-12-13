using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CabinetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CabinetController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cabinet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cabinet>>> GetCabinets()
        {
            return await _context.Cabinets.ToListAsync();
        }

        // GET: api/Cabinet/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cabinet>> GetCabinet(string id)
        {
            var cabinet = await _context.Cabinets.FindAsync(id);

            if (cabinet == null)
            {
                return NotFound();
            }

            return cabinet;
        }

        // PUT: api/Cabinet/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCabinet(string id, Cabinet cabinet)
        {
           var existingCabinet = await _context.Cabinets.FindAsync(id);

		   if (existingCabinet == null) return NotFound(new { message = "Cabinet not found" }); 

		   var newName = cabinet.RoomName;

		   await _context.Database.ExecuteSqlInterpolatedAsync($"Update cabinet set room_name = {newName} where room_name = {id}");

		   return NoContent();
        }

        // POST: api/Cabinet
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cabinet>> PostCabinet(Cabinet cabinet)
        {
            _context.Cabinets.Add(cabinet);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CabinetExists(cabinet.RoomName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCabinet", new { id = cabinet.RoomName }, cabinet);
        }

        // DELETE: api/Cabinet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCabinet(string id)
        {
            var cabinet = await _context.Cabinets.FindAsync(id);
            if (cabinet == null)
            {
                return NotFound();
            }

            _context.Cabinets.Remove(cabinet);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CabinetExists(string id)
        {
            return _context.Cabinets.Any(e => e.RoomName == id);
        }
    }
}
