using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

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
            return await _context.Marks.Include(x => x.Statement).Include(x => x.Student).Select(mark => new Mark()
			{
				Mark1 = mark.Mark1,
				StatementId = mark.StatementId,
				StudentId = mark.StudentId,
				Statement = new Statement()
				{
					Id = mark.Statement.Id,
					ExamDisciplineId = mark.Statement.ExamDisciplineId,
					SessionYear = mark.Statement.SessionYear,
					DateIssued = mark.Statement.DateIssued,
				},
				Student = new Student()
				{
					Id = mark.Student.Id,
					Firstname = mark.Student.Firstname,
					Surname = mark.Student.Surname,
					Patronymic = mark.Student.Patronymic,
					Course = mark.Student.Course,
					Birthdate = mark.Student.Birthdate,
					GroupName = mark.Student.GroupName
				}
			}).OrderByDescending(date => date.Statement.DateIssued).ToListAsync();
        }

        // GET: api/Mark/5/1
        [HttpGet("{studentId}/{statementId}")]
        public async Task<ActionResult<Mark>> GetMark(Guid studentId, Guid statementId)
        {
            var mark = await _context.Marks.Include(x => x.Statement).ThenInclude(x => x.ExamDiscipline).Include(x => x.Student).FirstOrDefaultAsync(x => x.StudentId == studentId && x.StatementId == statementId);

            if (mark == null)
            {
                return NotFound();
            }

            return mark;
        }

        // PUT: api/Mark/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPut("{studentId}/{statementId}")]
        public async Task<IActionResult> PutMark(Guid studentId, Guid statementId, MarkDto mark)
        {
			try
			{
				var existMark = await _context.Marks.Include(x => x.Statement).Include(x => x.Student).FirstOrDefaultAsync(x => x.StudentId == studentId && x.StatementId == statementId);
				if (existMark == null) return NotFound(new { message = "Mark not found" });

				if (!string.IsNullOrEmpty(mark.Mark1))
				{
					existMark.Mark1 = mark.Mark1;
				}

				if (!string.IsNullOrEmpty(mark.StatementId))
				{
					existMark.StatementId = new Guid(mark.StatementId);
					existMark.Statement = await _context.Statements.Include(x => x.ExamDiscipline).FirstOrDefaultAsync(x => x.Id == existMark.StatementId) ?? throw new Exception("Statement not found");
				}

				if (!string.IsNullOrEmpty(mark.StudentId))
				{
					existMark.StudentId = new Guid(mark.StudentId);
					existMark.Student = await _context.Students.FirstOrDefaultAsync(x => x.Id == existMark.StudentId) ?? throw new Exception("Student not found");
				}

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
				return BadRequest(new { message = ex.Message });
            }
			catch (Exception ex)
			{
				return BadRequest(new { message = ex.Message });
			}

            return NoContent();
        }

		public record MarkDto(string Mark1, string StudentId, string StatementId);

        // POST: api/Mark
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPost]
        public async Task<ActionResult<Mark>> PostMark(MarkDto mark)
        {
			var studentId = new Guid(mark.StudentId);
			var statementId = new Guid(mark.StatementId);

			var statement = await _context.Statements.FirstOrDefaultAsync(x => x.Id == statementId);
			if (statement == null) return NotFound(new { message = "Statement not found" });

			var student = await _context.Students.FirstOrDefaultAsync(x => x.Id == studentId);
			if (student == null) return NotFound(new { message = "Student not found" });

			var markExists = await _context.Marks.FirstOrDefaultAsync(x => x.StatementId == statementId && x.StudentId == studentId);
			if (markExists != null) return Conflict(new { message = "Mark already exists" });

			var newMark = new Mark()
			{
				Mark1 = mark.Mark1,
				StatementId = statementId,
				StudentId = studentId
			};
			_context.Marks.Add(newMark);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
				if (ex.InnerException != null)
				{
					return Conflict(ex.InnerException.Message);
				}
				return Conflict(ex.Message);
            }

            return CreatedAtAction("GetMark", new { studentId, statementId }, newMark);
        }

		// DELETE: api/Mark/5/7
		[Authorize]
		[HttpDelete("{studentId}/{statementId}")]
		public async Task<IActionResult> DeleteMark(Guid studentId, Guid statementId)
		{
			var mark = await _context.Marks
				.FirstOrDefaultAsync(m => m.StudentId == studentId && m.StatementId == statementId);
			if (mark == null)
			{
				return NotFound(new { message = "Mark not found" });
			}

			_context.Marks.Remove(mark);
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException ex)
			{
				if (ex.InnerException != null)
				{
					return Conflict(ex.InnerException.Message);
				}
				return Conflict(ex.Message);
			}

			return NoContent();
		}


		private bool MarkExists(Guid id)
        {
            return _context.Marks.Any(e => e.StudentId == id);
        }
    }
}
