var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.backend>("webapi");

var react = builder.AddNpmApp("vite", "../frontend")
	.WithReference(api)
	.WaitFor(api)
	.WithHttpEndpoint(5173, 5175, isProxied: true)
	.WithExternalHttpEndpoints();

var nextjs = builder.AddNpmApp("next", "../session-test")
	.WithReference(api)
	.WaitFor(api)
	.WithHttpEndpoint(3000, 3001, isProxied: true)
	.WithExternalHttpEndpoints();

builder.Build().Run();