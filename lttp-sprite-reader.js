const fs = require("fs");
const { promises: fsp } = fs;

(async () => {
  console.log("Reading dir...");
  const list = await fsp
    .readdir(".")
    .then((dir) => dir.filter((file) => file.endsWith(".zspr")))
    .then((dir) =>
      dir.map((file) => {
        const sprite = fs.openSync(file);
        let buf = Buffer.alloc(0x04);

        const ReadUTF16LEStr = () => {
          let retval = "";
          const buf = Buffer.alloc(0x02);
          while (retval.length < 64) {
            fs.readSync(sprite, buf, 0, 0x02);
            if (buf.readInt16LE() === 0) return retval;
            else retval += buf.toString("utf16le");
          }
          console.warn("Read buffer overflow");
          return retval;
        };

        fs.readSync(sprite, buf, 0, 0x04);
        if (buf.toString("ascii") !== "ZSPR") return null;

        buf = Buffer.alloc(0x19);
        fs.readSync(sprite, buf, 0, 0x19);

        let name = ReadUTF16LEStr();
        const author = ReadUTF16LEStr();

        if (name.endsWith(` (${author})`))
          name = name.substr(0, name.length - (author.length + 3));

        return {
          file: file.substr(0, file.indexOf(".")),
          name,
          author,
        };
      })
    )
    .then((sprites) => sprites.filter((sprite) => sprite !== null))
    .then((sprites) => sprites.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }))

  console.log("Writing JSON data...");
  fs.writeFileSync("lttp-sprites.json", JSON.stringify(list));
})();
