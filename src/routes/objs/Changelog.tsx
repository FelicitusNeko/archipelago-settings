import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

type ChangelogLine = (string | ChangelogLine)[];
const changelogData: Record<
  string,
  ChangelogLine
// eslint-disable-next-line @typescript-eslint/no-var-requires
> = require("../../defs/changelog.json");

interface ChangelogPage {
  version: string;
  lines: string[];
}

const Changelog: React.FC = () => {
  const [curPage, setCurPage] = useState(0);

  const changelogPages = (() => {
    const retval: ChangelogPage[] = [];
    let curCollection: string[] = [];
    let curFirstLine: string | null = null;
    let curLastLine: string | null = null;
    let verCount = 0;

    for (const [version, lines] of Object.entries(changelogData)) {
      if (++verCount % 10 === 0) {
        curCollection.pop();
        retval.push({ version: `${curFirstLine}...${curLastLine}`, lines: curCollection });
        curCollection = [];
      }

      /**
       * Reads a list of changelog data to be displayed.
       * @param data The data to read.
       * @param level The nesting level of the current list.
       */
      const Reader = (data: ChangelogLine, level = 0) => {
        const spacing = (() => {
          let retval = "";
          for (let x = 0; x < level; x++) retval += "  ";
          return retval + "- ";
        })();
        for (const line of data)
          if (Array.isArray(line)) Reader(line, level + 1);
          else curCollection.push(spacing + line);
      };

      if (curFirstLine === null) curFirstLine = version;
      curLastLine = version;

      curCollection.push(`#### ${version}`);
      Reader(lines);
      curCollection.push("---");
    }

    curCollection.pop();
    retval.push({ version: `${curFirstLine}...${curLastLine}`, lines: curCollection });

    return retval;
  })();

  const pageData = changelogPages[curPage];

  return (<>
    <button onClick={() => setCurPage(Math.max(curPage - 1, 0))} disabled={curPage === 0}>Prev</button>
    <button onClick={() => setCurPage(Math.min(curPage + 1, changelogPages.length - 1))} disabled={curPage + 1 == changelogPages.length}>Next</button><br />
    <ReactMarkdown>{pageData.lines.join("\n")}</ReactMarkdown>
  </>);
};

export default Changelog;
