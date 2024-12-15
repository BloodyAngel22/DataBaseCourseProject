using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Filters;
using backend.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatementController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Statement
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Statement>>> GetStatements([FromQuery] StatementFilter filter)
		{
			var statements = await _context.Statements
				.Include(x => x.ExamDiscipline)
				.Select(statement => new Statement
				{
					Id = statement.Id,
					ExamDisciplineId = statement.ExamDisciplineId,
					SessionYear = statement.SessionYear,
					DateIssued = statement.DateIssued,
					ExamDiscipline = new ExamDiscipline
					{
						Id = statement.ExamDiscipline.Id,
						DisciplineName = statement.ExamDiscipline.DisciplineName,
						EventDatetime = statement.ExamDiscipline.EventDatetime,
						LecturerId = statement.ExamDiscipline.LecturerId,
						CabinetRoomName = statement.ExamDiscipline.CabinetRoomName,
						EventFormType = statement.ExamDiscipline.EventFormType
					}
				})
				.Filter(filter)
				.ToListAsync();

			return statements;
		}

		// GET: api/Statement/5
		[HttpGet("{id}")]
        public async Task<ActionResult<Statement>> GetStatement(Guid id)
        {
            var statement = await _context.Statements.Include(x => x.ExamDiscipline).FirstOrDefaultAsync(x => x.Id == id);

            if (statement == null)
            {
                return NotFound();
            }

            return statement;
        }

        // PUT: api/Statement/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatement(Guid id, Statement statement)
        {
			var existingStatement = await _context.Statements.FindAsync(id);

			if (existingStatement == null) return NotFound(new { message = "Statement not found" });

            _context.Entry(statement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatementExists(id))
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
		public record StatementDTO(string ExamDisciplineId, string SessionYear, string DateIssued);

		// POST: api/Statement
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
		[HttpPost]
		public async Task<ActionResult<Statement>> PostStatement(StatementDTO statement)
		{
			var examDiscipline = await _context.ExamDisciplines.FindAsync(new Guid(statement.ExamDisciplineId));
			if (examDiscipline == null) return NotFound(new { message = "ExamDiscipline not found" });

			var existingStatement = await _context.Statements.FirstOrDefaultAsync(x => x.ExamDisciplineId == examDiscipline.Id);
			if (existingStatement != null) return Conflict(new { message = "Statement already exists" });

			var newStatement = new Statement
			{
				Id = Guid.NewGuid(),
				ExamDisciplineId = examDiscipline.Id,
				SessionYear = short.TryParse(statement.SessionYear, out var sessionYear) ? sessionYear : throw new Exception("Invalid sessionYear format"),
				DateIssued = DateOnly.TryParse(statement.DateIssued, out var dateIssued) ? dateIssued : throw new Exception("Invalid dateIssued format"),
				ExamDiscipline = examDiscipline
			};

			_context.Entry(examDiscipline).State = EntityState.Unchanged;

			_context.Statements.Add(newStatement);
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException ex)
			{
				if (ex.InnerException != null)
				{
					if (ex.InnerException.Message.Contains("Cannot insert duplicate key") ||
						ex.InnerException.Message.Contains("23505: duplicate key value violates unique constraint"))
					{
						return Conflict(new { message = "Statement already exists" });
					}
				}
				return Conflict(ex.Message);
			}


			return CreatedAtAction("GetStatement", new { id = newStatement.Id }, newStatement);
        }

        // DELETE: api/Statement/5
		[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatement(Guid id)
        {
            var statement = await _context.Statements.FindAsync(id);
            if (statement == null)
            {
                return NotFound();
            }

            _context.Statements.Remove(statement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StatementExists(Guid id)
        {
            return _context.Statements.Any(e => e.Id == id);
        }
    }
}
