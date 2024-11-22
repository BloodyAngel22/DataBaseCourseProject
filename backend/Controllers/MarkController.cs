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
    public class MarkController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MarkController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Mark
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mark>>> GetMarks()
        {
            return await _context.Marks.ToListAsync();
        }

        // GET: api/Mark/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mark>> GetMark(Guid id)
        {
            var mark = await _context.Marks.FindAsync(id);

            if (mark == null)
            {
                return NotFound();
            }

            return mark;
        }

        // PUT: api/Mark/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMark(Guid id, Mark mark)
        {
            if (id != mark.StudentId)
            {
                return BadRequest();
            }

            _context.Entry(mark).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MarkExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Mark
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Mark>> PostMark(Mark mark)
        {
            _context.Marks.Add(mark);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (MarkExists(mark.StudentId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetMark", new { id = mark.StudentId }, mark);
        }

        // DELETE: api/Mark/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMark(Guid id)
        {
            var mark = await _context.Marks.FindAsync(id);
            if (mark == null)
            {
                return NotFound();
            }

            _context.Marks.Remove(mark);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MarkExists(Guid id)
        {
            return _context.Marks.Any(e => e.StudentId == id);
        }
    }
}
