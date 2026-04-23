const fs = require("fs");
const path = require("path");

const TARGET = "city-intelligence";

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");

      if (content.includes(TARGET)) {
        const lines = content.split("\n");

        const filtered = lines.filter(line => !line.includes(TARGET));

        if (lines.length !== filtered.length) {
          fs.writeFileSync(fullPath, filtered.join("\n"));
          console.log("Cleaned imports in:", fullPath);
        }
      }
    }
  }
}

walk(path.join(__dirname, "src"));
console.log("Done cleaning city-intelligence imports");