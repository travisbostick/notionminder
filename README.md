# notionminder

Two methods (NodeJS and Scriptable Siri Shortcut) that will find the word count of a notion database and create a Beeminder goal datapoint with that word count.

Both require:

- The ID of the Notion database you want to track.
- Your Notion API Key (Internal Integration Token)
- Your Beeminder auth_token
- The name of the Beeminder goal you want to update
- Your Beeminder username

## Scriptable Siri Shortcut

The Scriptable script in the "Scriptable" folder is triggered by a Siri Shortcut that can be found here: https://routinehub.co/shortcut/9166/

Input the information above in the dictionary and select the right Scriptable script to run within the shortcut.

## NodeJS

Install modules with `npm i`.

Replace the information above in the `.env` file. Do not include quotations or line breaks.

Run with `node index.js`.
