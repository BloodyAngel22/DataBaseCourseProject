using System.Text.Json.Serialization;
using backend;
using backend.Auth;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.AddServiceDefaults();

builder.Services.AddDbContext<AppDbContext>(opt => {
	opt.UseNpgsql(builder.Configuration.GetConnectionString("db"));
});

builder.Services.AddDbContext<AuthDbContext>(opt =>
{
	opt.UseNpgsql(builder.Configuration.GetConnectionString("auth_db"));
});

builder.Services.AddIdentity<AppUser, IdentityRole>()
	.AddEntityFrameworkStores<AuthDbContext>()
	.AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(opt =>
{
	opt.Password.RequireDigit = false;
	opt.Password.RequireLowercase = false;
	opt.Password.RequireUppercase = false;
	opt.Password.RequireNonAlphanumeric = false;
	opt.Password.RequiredLength = 4;
	opt.Lockout.AllowedForNewUsers = false;
	opt.User.RequireUniqueEmail = false;
});

builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions(opt => {
	opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
	opt.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.ConfigureApplicationCookie(opt => {
	opt.Cookie.Name = "AuthCookie";
	opt.LoginPath = "/api/auth/login";
	opt.LogoutPath = "/api/auth/logout";
	opt.ExpireTimeSpan = TimeSpan.FromDays(1);
	opt.SlidingExpiration = true;
});
builder.Services.AddAuthorization();

builder.Services.AddCors(opt => {
	opt.AddDefaultPolicy(policy => {
		policy.AllowAnyHeader()
			  .AllowAnyMethod()
			  .AllowCredentials()
			  .WithOrigins("http://localhost:5173", "http://localhost:3000");
	});
});

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
