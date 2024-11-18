using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class StudentsController(AppDbContext context) : ControllerBase
	{
		private readonly AppDbContext _context = context;

		[HttpGet("students")]
		public async Task<IActionResult> GetStudents() => Ok(await _context.Students.AsNoTracking().ToListAsync());

		[HttpGet("students-with-group")]
		public async Task<IActionResult> GetStudentsWithGroup() => Ok(await _context.Students.AsNoTracking().Include(s => s.GroupNameNavigation).ToListAsync());
	}
}