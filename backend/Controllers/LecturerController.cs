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
        public async Task<IActionResult> PutLecturer(Guid id, LecturerDTO lecturer)
        {
			var existingLecturer = await _context.Lecturers.Include(l => l.DepartmentNameNavigation).FirstOrDefaultAsync(l => l.Id == id);

			if (existingLecturer == null) return NotFound(new { message = "Lecturer not found" });

            try
            {
				if (!string.IsNullOrEmpty(lecturer.firstname)) existingLecturer.Firstname = lecturer.firstname;
				if (!string.IsNullOrEmpty(lecturer.surname)) existingLecturer.Surname = lecturer.surname;
				if (!string.IsNullOrEmpty(lecturer.patronymic)) existingLecturer.Patronymic = lecturer.patronymic;
				if (!string.IsNullOrEmpty(lecturer.birthdate.ToString())) existingLecturer.Birthdate = DateOnly.Parse(lecturer.birthdate);
				if (!string.IsNullOrEmpty(lecturer.departmentName))
				{
					existingLecturer.DepartmentName = lecturer.departmentName;

					existingLecturer.DepartmentNameNavigation = await _context.Departments.FirstOrDefaultAsync(d => d.Name == lecturer.departmentName) ?? throw new Exception("Invalid department name");
				}

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!LecturerExists(id))
                {
                    return NotFound(new { message = ex.Message });
                }
                else
                {
					return Conflict(new { message = ex.Message });
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
