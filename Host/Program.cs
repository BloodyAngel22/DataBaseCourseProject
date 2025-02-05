var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.backend>("webapi");

var nextjs = builder.AddNpmApp("next", "../frontend")
	.WithReference(api)
	.WaitFor(api)
	.WithHttpEndpoint(3000, 3001, isProxied: true)
	.WithExternalHttpEndpoints();

builder.Build().Run();
