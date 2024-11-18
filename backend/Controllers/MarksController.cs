using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarksController(AppDbContext context) : ControllerBase
    {
		private readonly AppDbContext _context = context;

		[HttpGet]
		public async Task<IActionResult> GetMarks() => Ok(await _context.Marks.AsNoTracking().Include(s => s.Student).ToListAsync());
    }
}