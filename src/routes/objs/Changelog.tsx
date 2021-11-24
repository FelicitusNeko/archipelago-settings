import React from "react";

const Changelog: React.FC = () => {
  return (
    <>
      <h4>0.10.1</h4>
      <ul>
        <li>Factorio: fixed misspelled "spanw" in "silo" option</li>
        <li>LttP: tweaked maximums for some items (Rupees, arrows, bombs)</li>
      </ul>
      <hr />
      <h4>0.10.0</h4>
      <ul>
        <li>
          Add item selection support
          <ul>
            <li>
              Items can now be designated as local, non-local, or starting
              inventory, as well as getting a starting hint for them
            </li>
            <li>
              Not yet supported for Factorio or Secret of Evermore due to lack
              of solid list of items
            </li>
          </ul>
        </li>
      </ul>
      <hr />
      <h4>0.9.4</h4>
      <ul>
        <li>
          Update spec to 0.2.0
          <ul>
            <li>Added Super Metroid, Secret of Evermore</li>
            <li>
              DeathLink added to LttP, OoT, SM, TS, Factorio: if one DeathLinked
              player dies, they all do
            </li>
            <li>LttP: More granular settings for Beemizer</li>
            <li>OoT: Entrance shuffle, owl drops</li>
          </ul>
        </li>
        <li>Reordered games based on their introduction to Archipelago</li>
        <li>Added Hybrid Major Glitches placement logic value to LttP</li>
      </ul>
      <hr />
      <h4>0.9.3</h4>
      <ul>
        <li>Background changes to make it easier to add new games</li>
        <li>Tweaked and fixed some LttP settings/dependencies</li>
        <li>
          Shortened longer setting values (hover over them to see a detailed
          description)
        </li>
        <li>Documented the hell out of the source code</li>
      </ul>
      <hr />
      <h4>0.9.2</h4>
      <ul>
        <li>Style tweak on weighted sliders</li>
        <li>
          Don't show dropdown for weighted string settings if all of them are on
          the table
        </li>
        <li>Fixed a couple of options in OoT</li>
        <li>Hide reset button for a setting if it is already default</li>
        <li>
          Reduce YAML output by removing sections for games definitely not being
          played (hold Ctrl to bypass this behaviour)
        </li>
        <li>
          Settings will now properly update if games/settings in them are
          added/removed
        </li>
      </ul>
      <hr />
      <h4>0.9.1</h4>
      <ul>
        <li>
          This is when I started the changelog. I didn't have version numbers up
          until now.
        </li>
        <li>
          Display app version and build time; clarify that "big" version is the
          current official server version at app build time
        </li>
      </ul>
      <hr />
      <h4>0.9</h4>
      Initial public release.
    </>
  );
};

export default Changelog;
