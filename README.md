## Archipelago Settings Tool

This tool has been built to supplement the Archipelago Multiworld system, and generate settings files (YAMLs) for players. The main reason this was created was because the current settings interface on the Archipelago website is very lacking. It may get better over time, but that doesn't help much if our group has decided to migrate to Archipelago *now*.

<<<<<<< HEAD
### Features

- Import both Archipelago and Berserker LttP YAMLs
- Per-setting weighted values for settings
- Reduce clutter by only showing relevant settings
- Configure settings for multiple games at once, if weighted values are being used to pick the game

### Building

This site was built using `create-react-app`, which means standard `cra` commands work when running or building this project locally.

Requirements:
- NodeJS 16 or higher
- Yarn Berry 3.0.x or higher
- TypeScript 4.2.x or higher

Just type `yarn` in the root of the project to install all libraries needed. As for running it:

=======
Features:
- Import both Archipelago and Berserker LttP YAMLs
- Per-setting weighted values for settings
- Reduce clutter by only showing relevant settings
- Configure settings for multiple games at once, if weighted values are being used to pick the game

### Building

This site was built using `create-react-app`, which means standard `cra` commands work when running or building this project locally.

Requirements:
- NodeJS 16 or higher
- Yarn Berry 3.0.x or higher
- TypeScript 4.2.x or higher

Just type `yarn` in the root of the project to install all libraries needed. As for running it:

>>>>>>> 0fe82b560323aff543c0f1bc7c87ce2d98fbaadd
**`yarn start`** - Runs a local server that updates live as the code is modified and saved.
**`yarn build`** - Builds a static version of the site which can then be uploaded. This site generally does not need any sort of server-side configuration.