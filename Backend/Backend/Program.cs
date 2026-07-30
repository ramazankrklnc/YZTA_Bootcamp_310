using Backend.Data;
using Backend.Interfaces;
using Backend.Repositories;
using Backend.Services;
using Backend.Controllers;
using Microsoft.EntityFrameworkCore;
using Backend.Helpers;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration
        .GetConnectionString("DefaultConnection")
    );
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IChatSessionRepository, ChatSessionRepository>();

builder.Services.AddScoped<IChatMessageRepository, ChatMessageRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<ISessionService, SessionService>();

builder.Services.AddScoped<IPythonAgentService, PythonAgentService>();
builder.Services.AddHttpClient<IPythonAgentService, PythonAgentService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8000");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
