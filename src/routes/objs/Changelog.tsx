import React from "react";
import ReactMarkdown from "react-markdown";

type ChangelogLine = (string | ChangelogLine)[];
const changelogData:Record<string, ChangelogLine> = require("../../defs/changelog.json");

const Changelog: React.FC = () => {
  /** Parsed data to display in the changelog. */
  const parsedData: string[] = [];
  /**
   * Reads a list of changelog data to be displayed.
   * @param data The data to read.
   * @param level The nesting level of the current list.
   */
  const Reader = (data: ChangelogLine, level = 0) => {
    const spacing = (() => {let retval = ''; for (let x = 0; x < level; x++) retval += '  '; return retval + "- ";})()
    for (const line of data) if (Array.isArray(line)) Reader(line, level + 1);
    else parsedData.push(spacing + line);
  }
  for (const version in changelogData) {
    parsedData.push(`#### ${version}`);
    Reader(changelogData[version]);
    parsedData.push('---');
  }
  parsedData.pop();

  return (
    <ReactMarkdown children={parsedData.join('\n')} />
  );
};

export default Changelog;
