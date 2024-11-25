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
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Department
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
			var departments = await _context.Departments.AsNoTracking().OrderBy(d => d.Name).ToListAsync();
			// foreach (var department in departments)
			// {
			// 	department.Name = char.ToUpper(department.Name[0]) + department.Name[1..];
			// }

            return departments;
        }

        // GET: api/Department/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(string id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            return department;
        }

		// PUT: api/Department/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
	[HttpPut("{id}")]
public async Task<IActionResult> PutDepartment(string id, Department department)
{
    // Находим существующий департамент
    var existingDepartment = await _context.Departments.Include(d => d.Groups).Include(d => d.Lecturers).FirstOrDefaultAsync(d => d.Name == id);

    if (existingDepartment == null)
    {
        return NotFound($"Department with ID {id} not found.");
    }

    // Убираем связи зависимых объектов
    foreach (var group in existingDepartment.Groups)
    {
        group.DepartmentName = null; // Убираем FK
    }
    foreach (var lecturer in existingDepartment.Lecturers)
    {
        lecturer.DepartmentName = null; // Убираем FK
    }

    // Сохраняем изменения, чтобы отвязать зависимости
    await _context.SaveChangesAsync();

    // Удаляем старый департамент
    _context.Departments.Remove(existingDepartment);
    await _context.SaveChangesAsync();

    // Создаем новый департамент
    var newDepartment = new Department
    {
        Name = department.Name,
        // Добавляем дополнительные свойства, если они есть
    };
    _context.Departments.Add(newDepartment);
    await _context.SaveChangesAsync();

    // Перепривязываем зависимости к новому департаменту
    foreach (var group in existingDepartment.Groups)
    {
        group.DepartmentName = newDepartment.Name; // Привязываем к новому FK
    }
    foreach (var lecturer in existingDepartment.Lecturers)
    {
        lecturer.DepartmentName = newDepartment.Name; // Привязываем к новому FK
    }

    // Сохраняем изменения
    await _context.SaveChangesAsync();

    return NoContent();
}
	

		// POST: api/Department
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
        public async Task<ActionResult<Department>> PostDepartment(Department department)
        {
            _context.Departments.Add(department);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DepartmentExists(department.Name))
                {
                    return Conflict(new { message = "Department already exists" });
                }
                else
                {
                    // throw;
					return Conflict(new { message = "Something went wrong" });
                }
            }

            return CreatedAtAction("GetDepartment", new { id = department.Name }, department);
        }

        // DELETE: api/Department/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(string id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartmentExists(string id)
        {
            return _context.Departments.Any(e => e.Name == id);
        }
    }
}
