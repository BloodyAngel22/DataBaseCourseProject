import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
	/* config options here */
	serverRuntimeConfig: {
		Proxy: {
			"/api": {
				target: "https://localhost:7280",
				changeOrigin: true,
				pathRewrite: { "^/api": "" },
			},
		},
	},
};

export default nextConfig;
