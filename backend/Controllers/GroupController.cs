using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Data;
using Npgsql;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly AppDbContext _context;
		private readonly ILogger<GroupController> _logger;

        public GroupController(AppDbContext context, ILogger<GroupController> logger)
        {
            _context = context;
			_logger = logger;
        }

        // GET: api/Group
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
        {
            return await _context.Groups.ToListAsync();
        }

        // GET: api/Group/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetGroup(string id)
        {
            var @group = await _context.Groups.FindAsync(id);

            if (@group == null)
            {
                return NotFound();
            }

            return @group;
        }

        // PUT: api/Group/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGroup(string id, GroupDTO @group)
        {
			var existingGroup = await _context.Groups.FindAsync(id);
			if (existingGroup == null) return BadRequest(new { message = "Group not found" });

			var newName = @group.Name;

			try
			{
				if (existingGroup.Name != newName && existingGroup.DepartmentName == @group.DepartmentName)
				{
					await _context.Database.ExecuteSqlInterpolatedAsync($"Update \"group\" set name = {newName} where name = {id}");
				}
				else if (existingGroup.Name == newName && existingGroup.DepartmentName != @group.DepartmentName)
				{
					await _context.Database.ExecuteSqlInterpolatedAsync($"Update \"group\" set department_name = {@group.DepartmentName} where name = {id}");
				}
				else
				{
					await _context.Database.ExecuteSqlInterpolatedAsync($"Update \"group\" set name = {newName}, department_name = {@group.DepartmentName} where name = {id}");
				}
			}
			catch (Exception ex)
			{
				if (ex.InnerException != null)
				{
					if (ex.InnerException.Message.Contains("23505: duplicate key value"))
					{
						_logger.LogError("PostgresException: {Message}", ex.Message);
						return Conflict(new { message = "A group with the same primary key or unique constraint already exists." });
					}
					return Conflict(new { message = ex.InnerException.Message });
				}
				if (ex.Message.Contains("23505: duplicate key value"))
				{
					_logger.LogError("PostgresException: {Message}", ex.Message);
					return Conflict(new { message = "A group with the same primary key or unique constraint already exists." });
				}
				_logger.LogError("Exception: {Message}", ex.Message);
				return Conflict(new { message = ex.Message });
			}

			return NoContent();
		}

		public record GroupDTO(string Name, string DepartmentName);

        // POST: api/Group
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[Authorize]
        [HttpPost]
        public async Task<ActionResult<Group>> PostGroup(GroupDTO @group)
        {
			var department = await _context.Departments.FindAsync(@group.DepartmentName);

			if (department == null)
			{
				return BadRequest(new { message = "Department not found" });
			}

			var newGroup = new Group
			{
				Name = @group.Name,
				DepartmentName = @group.DepartmentName,
				DepartmentNameNavigation = department
			};

            _context.Groups.Add(newGroup);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (GroupExists(@group.Name))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetGroup", new { id = @group.Name }, @group);
        }

        // DELETE: api/Group/5
		[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(string id)
        {
            var @group = await _context.Groups.FindAsync(id);
            if (@group == null)
            {
                return NotFound();
            }

            _context.Groups.Remove(@group);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GroupExists(string id)
        {
            return _context.Groups.Any(e => e.Name == id);
        }
    }
}
