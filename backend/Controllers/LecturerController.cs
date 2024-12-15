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
		[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLecturer(Guid id, Lecturer lecturer)
        {
			var existingLecturer = await _context.Lecturers.FindAsync(id);

			if (existingLecturer == null) return NotFound(new { message = "Lecturer not found" });

            try
            {
				_context.Entry(lecturer).State = EntityState.Modified;
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

		public record LecturerDTO(string firstname, string surname, string patronymic, string birthdate, string departmentName);

        // POST: api/Lecturer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPost]
        public async Task<ActionResult<Lecturer>> PostLecturer(LecturerDTO lecturer)
        {
			var newLecturer = new Lecturer
			{
				Firstname = lecturer.firstname,
				Surname = lecturer.surname,
				Patronymic = lecturer.patronymic,
				Birthdate = DateOnly.TryParse(lecturer.birthdate, out var birthdate) ? birthdate : throw new Exception("Invalid birthdate format"),
				DepartmentName = lecturer.departmentName
			};

            _context.Lecturers.Add(newLecturer);
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException)
			{
				if (LecturerExists(newLecturer.Id))
				{
					return Conflict(new { message = "Lecturer already exists" });
				}
				else
				{
					return Conflict(new { message = "Something went wrong" });
				}
			}
			catch (Exception ex)
			{
				if (ex.InnerException != null)
				{
					if (ex.InnerException.Message.Contains("23505: duplicate key value"))
					{
						return Conflict(new { message = "Lecturer already exists" });
					}
				}
				return Conflict(new { message = "Something went wrong" });
			}

            return CreatedAtAction("GetLecturer", new { id = newLecturer.Id }, newLecturer);
        }

        // DELETE: api/Lecturer/5
		[Authorize]
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
