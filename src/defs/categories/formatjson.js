// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readdirSync, readFileSync, unlinkSync, writeFileSync } = require("fs");


for (const file of readdirSync(".")) {
  if (file.endsWith(".json")) {
    const readfile = JSON.parse(readFileSync(file));
    unlinkSync(file);
    writeFileSync(file, JSON.stringify(readfile, null, 2));
  }
}