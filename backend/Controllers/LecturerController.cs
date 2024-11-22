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
    public class LecturerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LecturerController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Lecturer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lecturer>>> GetLecturers()
        {
            return await _context.Lecturers.ToListAsync();
        }

        // GET: api/Lecturer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lecturer>> GetLecturer(Guid id)
        {
            var lecturer = await _context.Lecturers.FindAsync(id);

            if (lecturer == null)
            {
                return NotFound();
            }

            return lecturer;
        }

        // PUT: api/Lecturer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLecturer(Guid id, Lecturer lecturer)
        {
            if (id != lecturer.Id)
            {
                return BadRequest();
            }

            _context.Entry(lecturer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LecturerExists(id))
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

        // POST: api/Lecturer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Lecturer>> PostLecturer(Lecturer lecturer)
        {
            _context.Lecturers.Add(lecturer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLecturer", new { id = lecturer.Id }, lecturer);
        }

        // DELETE: api/Lecturer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLecturer(Guid id)
        {
            var lecturer = await _context.Lecturers.FindAsync(id);
            if (lecturer == null)
            {
                return NotFound();
            }

            _context.Lecturers.Remove(lecturer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LecturerExists(Guid id)
        {
            return _context.Lecturers.Any(e => e.Id == id);
        }
    }
}
