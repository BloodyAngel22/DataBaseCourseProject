using System.Text.Json.Serialization;
using backend;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(opt => {
	opt.UseNpgsql(builder.Configuration.GetConnectionString("db"));
});

builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions(opt => {
	opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
	opt.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddCors(opt => {
	opt.AddDefaultPolicy(policy => {
		policy.AllowAnyHeader()
			  .AllowAnyMethod()
			  .WithOrigins(builder.Configuration.GetConnectionString("frontend_url") ?? "");
	});
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.UseCors();

app.Run();