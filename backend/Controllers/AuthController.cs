using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
		private readonly SignInManager<AppUser> _signInManager;
		private readonly UserManager<AppUser> _userManager;

		public AuthController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager)
		{
			_signInManager = signInManager;
			_userManager = userManager;
		}

		public record LoginRequest(string Username, string Password);
		public record RegisterRequest(string Username, string Password, string Email);

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
		{
			EmailAddressAttribute emailAttribute = new();
			if (!emailAttribute.IsValid(registerRequest.Email)) return BadRequest(new { message = "Invalid email" });

			var user = new AppUser
			{
				UserName = registerRequest.Username,
				Email = registerRequest.Email
			};

			var result = await _userManager.CreateAsync(user, registerRequest.Password);

			if (!result.Succeeded) return BadRequest(new { message = result.Errors });

			var signin = await _signInManager.PasswordSignInAsync(user, registerRequest.Password, true, false);

			if (!signin.Succeeded) return BadRequest(new { message = "Something went wrong" });

			return Ok(new { message = "Registration successful and login successful" });
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginRequest loginRequest)
		{
			var user = await _userManager.FindByNameAsync(loginRequest.Username);
			if (user == null) return BadRequest(new { message = "User not found" });

			var result = await _signInManager.PasswordSignInAsync(user, loginRequest.Password, true, false);

			if (!result.Succeeded) return BadRequest(new { message = "Invalid credentials" });

			return Ok(new { message = "Login successful" });
		}

		[Authorize]
		[HttpPost("logout")]
		public async Task<IActionResult> Logout()
		{
			await _signInManager.SignOutAsync();
			return Ok(new { message = "Logout successful" });
		}

		[Authorize]
		[HttpGet("me")]
		public IActionResult Me()
		{
			var username = User.Identity?.Name;
			return Ok(username);
		}
    }
}