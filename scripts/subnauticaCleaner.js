const { readFileSync, writeFileSync } = require("fs");

const snData = JSON.parse(readFileSync("./003-subnautica.json").toString());
for (const item of snData.items) {
  if (item.readableName) {
    item.name = item.readableName;
    delete item.readableName;
  }
}
writeFileSync("./003-subnauticafix.json", JSON.stringify(snData, null, 2));