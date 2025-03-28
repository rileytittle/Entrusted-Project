To get the project up and running on your local computer,
you have two options.

1. Run in production mode (Preferred Way)

-   open up a terminal in the root directory.
-   cd into the frontend directory.
-   run "npm i"
-   run "npm run build"
-   when that is finished, cd back into the root directory,
    and then into the backend directory.
-   run "npm i"
-   run "npm run build"
-   when that is finished, run "npm run start"
-   you should see some messages pop up about it starting.
-   Navigate to http://localhost:3000 and you should see the app!

2. Run in a development mode (Requires slight code change)

-   change DEVELOPMENT true in the backend/src/index.ts
-   save file
-   open up a terminal in root directory
-   cd into the frontend directory
-   run "npm i"
-   run "npm run dev"
-   open up a separate terminal in the root directory
-   cd into backend directory
-   run "npm i"
-   run "npm run dev"
-   navigate to http://localhost:5173/ and you should see the app!

Sample API Requests:

ENDPOINT:

-   GET http://localhost:3000/tasks

PAYLOAD:

-   Request body:
    -   {
        "type":"object",
            "properties":{
                "name":{
                "type":"string"
                }
            }
        }
-   Header:
    -   {
        "x-api-key":"<api key to acccess API>"
        }

SUCCESSFUL RESPONSE:

-   Status: 200
-   Body: - {
    "type": "array",
    "items": {
    "type": "object",
    "properties": {
    "id": {
    "type": "number"
    },
    "name": {
    "type": "string"
    },
    "done": {
    "type": "number"
    }
    },
    "required": ["id", "name", "done"]
    }
    }

ERROR RESPONSE:

-   Status: 400
-   Body - {
    "type":"object",
    "properties":{
    "message":{
    "type":"string"
    },
    "error":{
    "type":Sqlite3 error object
    }
    }
    }
-   Status: 500
-   Body - {
    "type":"object",
    "properties":{
    "message":{
    "type":"string"
    },
    "error":{
    "type":Try/Catch error object
    }
    }
    }
