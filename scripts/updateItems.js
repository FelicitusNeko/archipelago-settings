const {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  unlinkSync,
  writeSync,
} = require('fs');
const { get: httpsGet } = require('https');

const { DATAPACKAGE_URL } = process.env;

const getDataPackage = () => {
  const url =
    DATAPACKAGE_URL ?? "https://archipelago.gg/api/datapackage";
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

  if (!existsSync(__dirname + "/itemloc")) {
    console.debug('Creating itemloc subdir');
    mkdirSync(__dirname + "/itemloc");
  }
  for (const category of Object.keys(dataPackage.games)) {
    const outFileName = __dirname + `/itemloc/${category}.json`;

    if (existsSync(outFileName)) unlinkSync(outFileName);

    const outFile = openSync(outFileName, "w");

    const { item_name_to_id, location_name_to_id } =
      dataPackage.games[category];
    let itemList = Object.entries(item_name_to_id)
      .sort((a, b) => a[1] - b[1])
      .map((i) => { return { name: i[0] } });
    const locationList = Object.entries(location_name_to_id)
      .sort((a, b) => a[1] - b[1])
      .map((i) => { return { name: i[0] } });

    writeSync(
      outFile,
      JSON.stringify({
        items: itemList,
        locations: locationList
      }, undefined, 2)
    );

    closeSync(outFile);
  }
})();