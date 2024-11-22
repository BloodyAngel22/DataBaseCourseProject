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
    public class EventFormController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventFormController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/EventForm
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventForm>>> GetEventForms()
        {
            return await _context.EventForms.ToListAsync();
        }

        // GET: api/EventForm/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventForm>> GetEventForm(string id)
        {
            var eventForm = await _context.EventForms.FindAsync(id);

            if (eventForm == null)
            {
                return NotFound();
            }

            return eventForm;
        }

        // PUT: api/EventForm/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEventForm(string id, EventForm eventForm)
        {
            if (id != eventForm.Type)
            {
                return BadRequest();
            }

            _context.Entry(eventForm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventFormExists(id))
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

        // POST: api/EventForm
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EventForm>> PostEventForm(EventForm eventForm)
        {
            _context.EventForms.Add(eventForm);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EventFormExists(eventForm.Type))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEventForm", new { id = eventForm.Type }, eventForm);
        }

        // DELETE: api/EventForm/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventForm(string id)
        {
            var eventForm = await _context.EventForms.FindAsync(id);
            if (eventForm == null)
            {
                return NotFound();
            }

            _context.EventForms.Remove(eventForm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventFormExists(string id)
        {
            return _context.EventForms.Any(e => e.Type == id);
        }
    }
}
