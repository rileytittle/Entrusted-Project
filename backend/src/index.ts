import express from "express";
import { Task } from "./models/task.model";
import db from "./db/database";

const PORT = process.env.PORT || 3000;
const app = express();

//DEV DATA
let masterTaskList: Task[] = [];
//DEV DATA

app.use(express.json());

function getAllTasks(res: any, successCode: number) {
	//query the database for all the records from task table
	db.all(`SELECT * FROM tasks`, [], (error, rows) => {
		if (error) {
			//if there was an error in the query execution, send 400 and error message
			res.status(400).send({
				message: "There was an error querying the database",
				error: error,
			});
		} else {
			//otherwise, send the result of the query
			res.status(successCode).send(rows);
		}
	});
}
/**
 * Middleware to send the master list of all tasks.
 *
 * This middleware sends back the entire list of tasks in the response.
 * If there is an unexpected error, it throws 500 status code so that the
 * server does not crash.
 *
 * @param {Express.Request} req - The request object, containing the incoming HTTP request.
 * @param {Express.Response} res - The response object, used to send the HTTP response.
 *
 * @returns {Task[]} The list of all tasks.
 *
 * @throws {400} If there is a problem executing the query.
 * @throws {500} If there is an unexpected error, status code 500 is sent.
 *
 * @example
 * [
 * 	{ 	"id": 1,
 * 		"name": "Finish backend api",
 * 		"done": 0
 * 	},
 * 	{
 * 		"id": 2,
 * 		"name": "Finish frontend",
 * 		"done": 0
 *  },
 * 	{
 * 		"id": 3,
 * 		"name": "Complete documentation",
 * 		"done": 0
 * 	}
 * ]
 */
app.get("/tasks", (req, res) => {
	//include try/catch block to catch any unexpected errors and keep
	//the server from crashing
	try {
		getAllTasks(res, 200);
	} catch (e) {
		//send 500 status code and error message, along with error object.
		res.status(500).send({
			message: "There was an error processing your request",
			error: e,
		});
	}
});
/**
 * Middleware to create a new task.
 *
 * This middleware checks if the request body has a task_name field
 * of type string. If it does, it creates a new task and adds it
 * to the master list of tasks.
 * If not, it sends back a response with a 400 status code.
 * If there is an unexpected error, it throws 500 status code so that the
 * server does not crash.
 *
 * @param {Express.Request} req - The request object, containing the incoming HTTP request.
 * @param {Express.Response} res - The response object, used to send the HTTP response.
 *
 * @returns {Task[]} The updated master list of tasks
 *
 * @throws {400} If "task_name" does not exist in request body or if it is not of type string.
 * @throws {500} If there is an unexpected error, status code 500 is sent.
 *
 */
app.post("/tasks", (req, res) => {
	//include try/catch block to catch any unexpected errors and keep
	//the server from crashing
	try {
		//check if task_name exists and is a string
		if (req.body.task_name && typeof req.body.task_name == "string") {
			db.run(
				`INSERT INTO tasks (name, done)
				VALUES (?, ?)`,
				[req.body.task_name, 0],
				(error) => {
					if (error) {
						return res.status(400).send({
							message: "Error adding task",
							error: error,
						});
					}
				}
			);
			getAllTasks(res, 201);
		} else {
			//if task_name doesn't exist or isn't a string, send error message and 400 status code.
			res.status(400).send({
				message:
					"Request must include the name of the task in string form",
			});
		}
	} catch (e) {
		//send 500 status code and error message, along with error object.
		res.status(500).send({
			message: "There was an error processing your request",
			error: e,
		});
	}
});

app.put("/tasks/:id", (req, res) => {
	//include try/catch block to catch any unexpected errors and keep
	//the server from crashing
	try {
		//check if param id is of type number
		if (typeof parseInt(req.params.id) == "number") {
			db.run(
				`UPDATE tasks
			SET done = CASE
				WHEN done = 1 THEN 0
				WHEN done = 0 THEN 1
				ELSE done
			END
			WHERE id = ?`,
				[parseInt(req.params.id)],
				(error) => {
					if (error) {
						res.status(400).send({
							message:
								"A problem occured when executing the query",
							error: error,
						});
					}
				}
			);
			getAllTasks(res, 200);
		} else {
			//if id is not of type number, send error and 400 status code.
			res.status(400).send({
				message: "Parameter id must be of type number",
			});
		}
	} catch (e) {
		//send 500 status code and error message, along with error object.
		res.status(500).send(e);
	}
});
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
