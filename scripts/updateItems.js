const {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  unlinkSync,
  writeSync,
} = require('fs');
const { get: httpGet } = require('http');
const { get: httpsGet } = require('https');

const { DATAPACKAGE_URL } = process.env;

const getDataPackage = () => {
  const url =
    DATAPACKAGE_URL ?? "https://archipelago.gg/api/datapackage";
  const matcher = /^http(s?):\/\//.exec(url);
  if (matcher === null) throw new Error("Invalid URL");
  const get = matcher[1] ? httpsGet : httpGet;
  console.debug(`Retrieving data from ${url}`);
  return new Promise((f, r) => {
    get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk.toString()));
      res.on("close", () => f(JSON.parse(data)));
      res.on("error", (e) => r(e));
    });
  });
};

getDataPackage().then(dataPackage => {
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
});
