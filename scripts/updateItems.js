const {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  unlinkSync,
  writeSync,
} = require('fs');
const {get: httpsGet} = require('https');
const {format} = require('util');

const { DATAPACKAGE_URL } = process.env;

const fileTemplate = `const Items: ArchipelagoItem[] = [
%s]
  
const Locations: ArchipelagoLocation[] = [
%s]
`;

const getDataPackage = () => {
  const url =
    DATAPACKAGE_URL ?? "https://archipelago.gg/api/datapackage";
  console.debug(url);
  return new Promise((f, r) => {
    httpsGet(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk.toString()));
      res.on("close", () => f(JSON.parse(data)));
      res.on("error", (e) => r(e));
    });
  });
};

(async () => {
  const dataPackage = await getDataPackage();
  //console.debug(dataPackage.games, Object.keys(dataPackage.games));

  if (!existsSync(__dirname + "/itemloc")) {
    console.debug('Creating itemloc subdir');
    mkdirSync(__dirname + "/itemloc");
  }
  for (const category of Object.keys(dataPackage.games)) {
    const outFileName = __dirname + `/itemloc/${category}.ts`;

    if (existsSync(outFileName)) unlinkSync(outFileName);

    const outFile = openSync(outFileName, "w");

    const { item_name_to_id, location_name_to_id } =
      dataPackage.games[category];
    let itemList = Object.entries(item_name_to_id)
      .sort((a, b) => a[1] - b[1])
      .map((i) => i[0]);
    const locationList = Object.entries(location_name_to_id)
      .sort((a, b) => a[1] - b[1])
      .map((i) => i[0]);

    writeSync(
      outFile,
      format(
        fileTemplate,
        itemList.map((i) => `  { name: "${i}" },\n`).join(""),
        locationList.map((i) => `  { name: "${i}" },\n`).join("")
      )
    );

    closeSync(outFile);
  }
})();