var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins("http://localhost:4200")));

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors();

app.MapGet("/test", () => new { Text = "Hello World" });

app.Run();
