import React from "react";

const Changelog: React.FC = () => {
  return (
    <>
      <h4>0.9.4</h4>
      <ul>
        {/* <li>
          Added item settings for every game except Factorio (as there is not a
          definitive list of items for that game)
        </li> */}
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
