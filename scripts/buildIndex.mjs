import { readdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pluginsDir = join(__dirname, "../plugins");

const plugins = readdirSync(pluginsDir, { withFileTypes: true });

const pluginsIndex = {
  version: 1,
  plugins: [],
};

const list = [];
plugins.forEach((file) => {
  if (file.isFile()) {
    const data = readFileSync(join(pluginsDir, file.name), { encoding: "utf8" });
    // 校验
    const plugin = JSON.parse(data);

    // 校验
    list.push(plugin);
  }
});

pluginsIndex.plugins = list.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

writeFileSync(join(__dirname, "../index.json"), JSON.stringify(pluginsIndex, null, 2), {
  encoding: "utf8",
});
