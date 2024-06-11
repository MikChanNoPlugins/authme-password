import path from "node:path";
import url from "node:url";
import { build as esbuild } from "esbuild";
import { globSync } from "glob";

const srcPath = path.join(process.cwd(), "src");
const buildPath = path.join(process.cwd(), "build");
const entryPoints = globSync("./src/**", { nodir: true })
	.filter((src) => !src.includes("__tests__"))
	.map((src) => path.join(process.cwd(), src));

async function build() {
	return await esbuild({
		platform: "node",
		target: "node21",
		format: "esm",
		nodePaths: [srcPath],
		sourcemap: true,
		external: [],
		bundle: false,
		minify: true,
		entryPoints: entryPoints,
		outdir: buildPath,
	});
}

if (import.meta.url.startsWith("file:")) {
	if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
		await build();
	}
}
