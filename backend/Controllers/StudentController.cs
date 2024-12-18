using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.Xml;
using backend.Filters;
using backend.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents([FromQuery] StudentFilter filter)
        {
			return Ok(await _context.Students.AsNoTracking().OrderBy(s => s.Course).ThenBy(s => s.GroupName).ThenBy(s => s.Surname).Filter(filter).ToListAsync());
        }

        // GET: api/Student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(Guid id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

		public record StudentDto(Guid id, string firstName, string surname, string patronymic, int course, string birthDate, string groupName);

		//TODO: Сделать обновление данных студента
        // PUT: api/Student/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(Guid id, StudentDto student)
        {
			var existingStudent = await _context.Students.Include(s => s.GroupNameNavigation).FirstOrDefaultAsync(s => s.Id == id);

			if (existingStudent == null) return NotFound(new { message = "Student not found" });


            try
            {
				if (!string.IsNullOrEmpty(student.firstName)) existingStudent.Firstname = student.firstName;
				if (!string.IsNullOrEmpty(student.surname)) existingStudent.Surname = student.surname;
				if (!string.IsNullOrEmpty(student.patronymic)) existingStudent.Patronymic = student.patronymic;
				if (!string.IsNullOrEmpty(student.birthDate.ToString())) existingStudent.Birthdate = DateOnly.Parse(student.birthDate);
				if (!string.IsNullOrEmpty(student.groupName))
				{
					existingStudent.GroupName = student.groupName;

					existingStudent.GroupNameNavigation = await _context.Groups.FirstOrDefaultAsync(g => g.Name == student.groupName) ?? throw new Exception("Invalid group name");
				}

				await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!StudentExists(id))
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

        // POST: api/Student
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(StudentDto student)
        {
			var newStudent = new Student
			{
				Id = Guid.NewGuid(),
				Firstname = student.firstName,
				Surname = student.surname,
				Patronymic = student.patronymic,
				Course = short.TryParse(student.course.ToString(), out var course) ? course : throw new Exception("Invalid course format"),
				Birthdate = DateOnly.TryParse(student.birthDate, out var birthdate) ? birthdate : throw new Exception("Invalid birthdate format"),
				GroupName = student.groupName
			};

            _context.Students.Add(newStudent);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = newStudent.Id }, student);
        }

        // DELETE: api/Student/5
		[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(Guid id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(Guid id)
        {
            return _context.Students.Any(e => e.Id == id);
        }
    }
}
