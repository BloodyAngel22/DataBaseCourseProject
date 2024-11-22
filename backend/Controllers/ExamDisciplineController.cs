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
    public class ExamDisciplineController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExamDisciplineController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ExamDiscipline
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamDiscipline>>> GetExamDisciplines()
        {
            return await _context.ExamDisciplines.ToListAsync();
        }

        // GET: api/ExamDiscipline/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDiscipline>> GetExamDiscipline(Guid id)
        {
            var examDiscipline = await _context.ExamDisciplines.FindAsync(id);

            if (examDiscipline == null)
            {
                return NotFound();
            }

            return examDiscipline;
        }

        // PUT: api/ExamDiscipline/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExamDiscipline(Guid id, ExamDiscipline examDiscipline)
        {
            if (id != examDiscipline.Id)
            {
                return BadRequest();
            }

            _context.Entry(examDiscipline).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamDisciplineExists(id))
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

        // POST: api/ExamDiscipline
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExamDiscipline>> PostExamDiscipline(ExamDiscipline examDiscipline)
        {
            _context.ExamDisciplines.Add(examDiscipline);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExamDiscipline", new { id = examDiscipline.Id }, examDiscipline);
        }

        // DELETE: api/ExamDiscipline/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExamDiscipline(Guid id)
        {
            var examDiscipline = await _context.ExamDisciplines.FindAsync(id);
            if (examDiscipline == null)
            {
                return NotFound();
            }

            _context.ExamDisciplines.Remove(examDiscipline);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExamDisciplineExists(Guid id)
        {
            return _context.ExamDisciplines.Any(e => e.Id == id);
        }
    }
}
