## Archipelago Settings Tool

This tool has been built to supplement the Archipelago Multiworld system, and generate settings files (YAMLs) for players. The main reason this was created was because the current settings interface on the Archipelago website is very limited. The aim of this tool is to make it as accessible as possible to all Archipelago players while also trying to offer as many of the YAML-enabled features as possible.

### Features

- Import both Archipelago and Berserker LttP YAMLs
- Settings for 18 Archipelago-supported games
  - Final Fantasy does not have AP-based configuration support and [does its own thing](https://finalfantasyrandomizer.com/)
- Per-setting weighted values for settings
- Item selector for all games; designate items as local, non-local, starting inventory, and/or starting hints
  - Option to make starting inventory apply to local items
- Location selector to designate locations as starting hints and/or excluded from progression logic
- Reduce clutter by only showing relevant settings and items
- Configure settings for multiple games at once, if weighted values are being used to pick the game

#### Not implemented yet

- Ability to import externally generated YAMLs for certain advanced applications (e.g. Final Fantasy, Factorio world gen)
- Meta ignore flags
- Triggers
- ItemLink

### Building

This site was built using `create-react-app`, which means standard `cra` commands work when running or building this project locally.

Requirements:
- NodeJS 16.x LTS (17 not currently supported by `react-scripts`)
- Yarn Berry 3.0.x or higher
- TypeScript 4.2.x or higher

Just type `yarn` in the root of the project to install all libraries needed. As for running it:

- **`yarn start`** - Runs a local server that updates live as the code is modified and saved.
- **`yarn build`** - Builds a static version of the site which can then be uploaded. This site generally does not need any sort of server-side configuration.