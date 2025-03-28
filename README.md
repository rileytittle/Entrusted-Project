# Cole's Entrusted Project

To get the project up and running on your local computer,
you have two options.

## Running the App

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

## API Request Schemas:

### Get all Tasks:

#### ENDPOINT

-   GET http://localhost:3000/tasks

#### PAYLOAD

-   Request body:
    -   none
-   Header:
    -   {
        "x-api-key":"api-key-value"
        }

#### SUCCESSFUL RESPONSE

-   Status: 200
-   Body:
    -   {
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
        }
        }
        }

#### ERROR RESPONSE

-   Status: 400
-   Body:
    -   {
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
-   Body:
    -   {
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

### Create new Task:

#### ENDPOINT

-   POST http://localhost:3000/tasks

#### PAYLOAD

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
        "x-api-key":"api-key-value"
        }

#### SUCCESSFUL RESPONSE

-   Status: 201
-   Body:
    -   {
        "type":"object",
        "properties":{
        "id":{
        "type":number
        }
        }
        }

#### ERROR RESPONSE

-   Status: 400 (Due to database error)
-   Body:
    -   {
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
-   Status: 400 (Due to name not existing or not being a string)
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }
-   Status: 500
-   Body:
    -   {
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

### Delete a Task:

#### ENDPOINT

-   DELETE http://localhost:3000/tasks/:id

#### PAYLOAD

-   Header: {
    "x-api-key":"api-key-value"
    }
-   Parameters: {
    "id":"task-id"
    }

#### SUCCESSFUL RESPONSE

-   Status: 204
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }

#### ERROR RESPONSE

-   Status: 400 (Due to database error)
-   Body:
    -   {
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
-   Status: 400 (Due to id not being a number)
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }
-   Status 404 (Due to not finding the task)
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }
-   Status: 500
-   Body: - {
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

### Change status of Task:

#### ENDPOINT

-   PUT http://localhost:3000/tasks/:id

#### PAYLOAD

-   Header: {
    "x-api-key":"api-key-value"
    }
-   Parameters: {
    "id":"task-id"
    }

#### SUCCESSFUL RESPONSE

-   Status: 200
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }

#### ERROR RESPONSE

-   Status: 400 (Due to database error)
-   Body:
    -   {
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
-   Status: 400 (Due to id not being a number)
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }
-   Status 404 (Due to not finding the task)
-   Body:
    -   {
        "type":"object",
        "properties":{
        "message":{
        "type":"string"
        }
        }
        }
-   Status: 500
-   Body: - {
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

### Design Choices and Notes

-   I went with Bootstrap for my component classes and styles.
-   I used Bootstrap's modal for the new task form because it feels
    simpler and less clunky to a user than going to a new page for a form.
    Just looks nicer than any other way to do a form.
-   For error messages, I opted for a simple red box that appears above everything
    except the title.
    -   I originally had the error box popping up underneath everything but as I wrote this,
        I realized that if there were a lot of tasks, the user might not immediately see the error message.
        The same might be true if the user is at the bottom of the screen, but I
        figured the top is better either way.
-   One breakthrough moment I had was when I figured out how to get the modal to work properly.
    -   I've never successfully used a bootstrap modal before this, so I originally
        had it working very strangely, using a state variable, some inline styling, and some arrow functions.
        I realized the modal was not using the animation it was supposed to be using, so
        I looked into it and it turns out all I needed to do was add some attributes to my
        add anothe button that would trigger Bootstrap's js and make the modal work properly.
-   Another breakthrough was getting the filter functionality right.
    -   I worked with a couple different solutions but each one had some sort of bug. I had to learn
        more about the useEffect hook and the dependency attached to it to make the filter functionality work.
    -   A note on this: I filtered on the frontend instead of the backend for three reasons:
        -   One: I thought I read about the optional filter under the front-end fair.
        -   Two: After I had implemented it, I figured I'd keep it that way to keep the backend simpler.
        -   Three: I originally thought it would result in less API calls, but I was wrong and it ended up being the same
            either way.
-   Final note: I did the brunt of the work on the backend in less commits because I forgot to commit after each endpoint,
    and creating APIs comes more naturally to me than frontend applications, so I did most of it in less time than the frontend.
