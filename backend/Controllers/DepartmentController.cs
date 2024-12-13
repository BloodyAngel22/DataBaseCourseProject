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
			var existingDepartment = await _context.Departments.FindAsync(id);

			if (existingDepartment == null)
			{
				return NotFound($"Department with ID {id} not found.");
			}

			var newName = department.Name;

			await _context.Database.ExecuteSqlInterpolatedAsync($"Update department set name = {newName} where name = {id}");

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

			try
			{
				_context.Departments.Remove(department);
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException ex)
			{
				if (ex.InnerException != null)
				{
					if (ex.InnerException.Message.Contains("Cannot delete or update a parent row: a foreign key constraint fails") ||
					 ex.InnerException.Message.Contains("23503: update or delete on table"))
					{
						return Conflict(new { message = "Cannot delete department with associated groups" });
					}
				}
				return Conflict("Something went wrong");
			}

			return NoContent();
		}

		private bool DepartmentExists(string id)
		{
			return _context.Departments.Any(e => e.Name == id);
		}
	}
}
