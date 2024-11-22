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
    public class StatementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatementController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Statement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Statement>>> GetStatements()
        {
            return await _context.Statements.ToListAsync();
        }

        // GET: api/Statement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Statement>> GetStatement(Guid id)
        {
            var statement = await _context.Statements.FindAsync(id);

            if (statement == null)
            {
                return NotFound();
            }

            return statement;
        }

        // PUT: api/Statement/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatement(Guid id, Statement statement)
        {
            if (id != statement.Id)
            {
                return BadRequest();
            }

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

        // POST: api/Statement
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Statement>> PostStatement(Statement statement)
        {
            _context.Statements.Add(statement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStatement", new { id = statement.Id }, statement);
        }

        // DELETE: api/Statement/5
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
