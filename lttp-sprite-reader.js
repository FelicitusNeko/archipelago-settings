/*
To run this, you will need NodeJS. Any recent version should do. If you're trying to
build this project, you hopefully already have it anyway.

How this works: Put this in your LttP Sprites folder ([Archipelago]\data\sprites\alttpr\)
and, in a command prompt, navigate to that directory and run "node lttp-sprite-reader".
Then, copy the resulting lttp-sprites.json file to the defs directory of the code repo.

This only relies on Node system libraries, so no externals are needed.
*/

const fs = require("fs");
const { promises: fsp } = fs;

(async () => {
  console.log("Reading dir...");
  const list = await fsp
    // Read the directory
    .readdir(".")
    // Filter out any files that are definitely not Z3 sprites
    .then((dir) => dir.filter((file) => file.endsWith(".zspr")))
    .then((dir) =>
      dir.map((file) => {
        /** The ZSPR sprite file. */
        const sprite = fs.openSync(file);
        /** The read buffer to use. */
        let buf = Buffer.alloc(0x04);

        /**
         * Reads a UTF-16 little-endian string from a file. 
         * @returns {string} The string that was read from the file.
         */
        const ReadUTF16LEStr = () => {
          /** The return value. */
          let retval = "";
          /** The read buffer to use. */
          const buf = Buffer.alloc(0x02);

          // Reads a maximum of 64 characters, just so that it doesn't blaze through the entire file if there's a problem
          while (retval.length < 64) {
            // Read a wide character
            fs.readSync(sprite, buf, 0, 0x02);
            // If it's a null terminator, return the file
            if (buf.readInt16LE() === 0) return retval;
            // Otherwise, add the character to the string
            else retval += buf.toString("utf16le");
          }

          // Oops, we hit 64 characters; return what we got
          console.warn("Read buffer overflow");
          return retval;
        };

        // Read the first four bytes
        fs.readSync(sprite, buf, 0, 0x04);
        // If they're not the ASCII letters ZSPR, this isn't actually a ZSPR sprite
        if (buf.toString("ascii") !== "ZSPR") return null;

        // Resize the buffer
        buf = Buffer.alloc(0x19);
        // Throw away the next 0x19 bytes (I don't know what they mean)
        // There's probably a better way to seek forward, but I don't know what it is in Node
        fs.readSync(sprite, buf, 0, 0x19);

        // Read out the name
        let name = ReadUTF16LEStr();
        // Read out the author
        const author = ReadUTF16LEStr();

        // If the author is mentioned in the name, cut it out (it would otherwise be repeated in the settings tool)
        if (name.endsWith(` (${author})`))
          name = name.substr(0, name.length - (author.length + 3));

        // Return structured data
        return {
          file: file.substr(0, file.indexOf(".")),
          name,
          author,
        };
      })
    )
    // Filter out any invalid sprite files
    .then((sprites) => sprites.filter((sprite) => sprite !== null))
    // Sort sprites by name
    .then((sprites) => sprites.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }))

  // Write out the data file
  console.log("Writing JSON data...");
  fs.writeFileSync("lttp-sprites.json", JSON.stringify(list));
})();
