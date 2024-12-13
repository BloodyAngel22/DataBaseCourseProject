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
			var existingExamDiscipline = await _context.ExamDisciplines.FindAsync(id);

			if (existingExamDiscipline == null) return NotFound(new { message = "ExamDiscipline not found" });

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

		public record ExamDisciplineDto(string DisciplineName, string EventDateTime, string LecturerId, string CabinetRoomName, string EventFormType);

        // POST: api/ExamDiscipline
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExamDiscipline>> PostExamDiscipline(ExamDisciplineDto examDiscipline)
        {
			var discipline = await _context.Disciplines.FindAsync(examDiscipline.DisciplineName);
			var lecturer = await _context.Lecturers.FindAsync(new Guid(examDiscipline.LecturerId));
			var cabinetRoom = await _context.Cabinets.FindAsync(examDiscipline.CabinetRoomName);
			var eventFormType = await _context.EventForms.FindAsync(examDiscipline.EventFormType);

			if (discipline == null) return NotFound(new { message = "Discipline not found" });
			if (lecturer == null) return NotFound(new { message = "Lecturer not found" });
			if (cabinetRoom == null) return NotFound(new { message = "CabinetRoom not found" });
			if (eventFormType == null) return NotFound(new { message = "EventFormType not found" });

            var newExamDiscipline = new ExamDiscipline
            {
				Id = Guid.NewGuid(),
				DisciplineName = discipline.Name,
				EventDatetime = DateTime.TryParse(examDiscipline.EventDateTime.ToString(), out var eventDateTime) ? eventDateTime : throw new Exception("Invalid eventDateTime format"),
				LecturerId = lecturer.Id,
				CabinetRoomName = cabinetRoom.RoomName,
				EventFormType = eventFormType.Type
            };
			_context.ExamDisciplines.Add(newExamDiscipline);
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				if (ex.InnerException != null)
				{
					return BadRequest(new { message = ex.InnerException.Message });
				}
				return BadRequest(new { message = ex.Message });
			}

            return CreatedAtAction("GetExamDiscipline", new { id = newExamDiscipline.Id}, newExamDiscipline);
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
