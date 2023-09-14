## Ironman

### Summary

Ironman is a gamemode option given to players to try to facilitate an experience designed to prevent them from cheating.
This means debugging and exporting are more difficult, it's exactly the type of mechanic ironman aims to prevent.
This causes us pain when figuring out problems derived, and reported, by ironman players.

### Debugging reports

#### Exporting

In ironman, autosaves are the only available way for the end-users to export.

For debugging purposes, there is a secret order of actions that can be taken to export data.

1. Save the current game. You are taken to the main menu.
2. Open the save menu.
3. Identify the save slot, and mouse over the coin icon.
4. Click the coin icon 3 times in succession.
5. Click [Copy Text Area]
6. Paste the text to a developer/report.

#### Importing

When importing an exported string of data, such as retrieved via the exporting guide, you must use the browser console to deserialise it.

The data given to you will be a JSON object with two parts:

-   Data
-   Details

**Data**: This is the full save object of that slot, typically located in your localstorage.

**Details**: This is the full details object, which contains metadata about your save.

When ironman was created, the save details structure was chosen to house the signatures of the ironman games, which are calculated using a hashing algorithm. Save details are never exported to the player to look at, and require them to access localstorage to even view. Therefore, we package the save details object with the export to ensure all information regarding ironman is available to the developer.

##### Import functions

Two functions are available to you to decode people's ironman saves:

-   IronMan.importDebug(data: string): CompositeSaveObject
-   IronMan.importAndLoadDebug(data: string): CompositeSaveObject

**IronMan.importDebug**: Returns the CompositeSaveObject, which is essentially an object containing two properties: Save-data, and the save-details. Useful for seeing what the deserialised data gets turned into, without having the game perform any processes on it.

**IronMan.importAndLoadDebug**: Returns the CompositeSaveObject, similar to _importDebug_, but also loads the data into the current state, as if you were loading a save game.
