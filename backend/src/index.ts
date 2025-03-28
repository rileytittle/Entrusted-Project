import express from "express";
import db from "./db/database";
import cors from "cors";
import path from "path";
import ApiKeyChecker from "./utils/keyChecker.utils";

const PORT = process.env.PORT || 3000;
const app = express();
const DEVELOPMENT = true;
app.use(express.json());

//conditional to either serve static files or
//use cors to allow api to talk to react frontend
//hosted with vite dev server
if (DEVELOPMENT) {
	//cors set up for dev
	app.use(
		cors({
			origin: "http://localhost:5173",
		})
	);
} else {
	//to serve static react files when project is built and started
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));
}

/**
 * this middleware queries the database for all
 * records in the tasks table and sends it back in
 * the response.
 * Serves 200 and the result of the query if successful.
 * Serves 400 if there is a database error or 500
 * if any other error occurs
 */
app.get("/tasks", ApiKeyChecker, (req, res) => {
	//include try/catch block to catch any unexpected errors and keep
	//the server from crashing
	try {
		db.all(`SELECT * FROM tasks`, [], (error, rows) => {
			if (error) {
				//if there was an error in the query execution, send 400 and error message
				res.status(400).send({
					message: "There was an error querying the database",
					error: error,
				});
			} else {
				//otherwise, send the result of the query
				res.status(200).send(rows);
			}
		});
	} catch (e) {
		//send 500 status code and error message, along with error object.
		res.status(500).send({
			message: "There was an error processing your request",
			error: e,
		});
	}
});

/**
 * this middleware creates a new task record in the
 * tasks table in the database.
 * Serves 201 and the id of the created record if successful.
 * Serves 400 if a name is not supplied or it it is
 * an empty string; also serves 400 if a database
 * error occurs.
 * Serves 500 if there is any another error.
 */
app.post("/tasks", ApiKeyChecker, (req, res) => {
	//include try/catch block to catch any unexpected errors and keep
	//the server from crashing
	try {
		//check if name exists and is a string
		if (req.body.name && req.body.name != "") {
			db.run(
				`INSERT INTO tasks (name, done)
				VALUES (?, ?)`,
				[req.body.name, 0],
				function (error) {
					if (error) {
						return res.status(400).send({
							message: "Error adding task",
							error: error,
						});
					}
					res.status(201).send({ id: this.lastID });
				}
			);
			//getAllTasks(res, 201);
		} else {
			//if name doesn't exist or isn't a string, send error message and 400 status code.
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

/**
 * this middleware deletes a record with an id matching the one
 * supplied in the parameters.
 * Serves 204 if successful.
 * Serves 400 if there is a database error or if the id is not a number.
 * Serves 404 if it cannot find a record matching the id.
 * Serves 500 if any other error occurs.
 */
app.delete("/tasks/:id", ApiKeyChecker, (req, res) => {
	try {
		if (!isNaN(parseInt(req.params.id))) {
			db.run(
				`DELETE FROM tasks
				WHERE id = ?`,
				[parseInt(req.params.id)],
				function (error) {
					if (error) {
						res.status(400).send({
							message:
								"An error occured while executing the query",
							error: error,
						});
					}
					if (this.changes === 0) {
						// No rows were deleted
						return res.status(404).send({
							message: "Task not found",
						});
					}
					res.status(204).send({
						message: "Task successfully deleted",
					});
				}
			);
		} else {
			//if id is not of type number, send error and 400 status code.
			res.status(400).send({
				message: "Parameter id must be of type number",
			});
		}
	} catch (error) {
		res.status(500).send({
			message: "There was an error deleting the task",
			error: error,
		});
	}
});
/**
 * this middleware flips the status of the done column
 * of the record matching the id supplied in the parameters.
 * Serves 200 if successful.
 * Serves 400 if there is a database error or if the supplied id is not a number.
 * Serves 404 if it cannot find a record with the supplied id.
 * Serves 500 if any other error occurs.
 */
app.put("/tasks/:id", ApiKeyChecker, (req, res) => {
	//include try/catch block to catch any unexpected errors and keep
	//the server from crashing
	try {
		//check if param id is of type number
		if (!isNaN(parseInt(req.params.id))) {
			db.run(
				`UPDATE tasks
			SET done = CASE
				WHEN done = 1 THEN 0
				WHEN done = 0 THEN 1
				ELSE done
			END
			WHERE id = ?`,
				[parseInt(req.params.id)],
				function (error) {
					if (error) {
						res.status(400).send({
							message:
								"A problem occured when executing the query",
							error: error,
						});
					}
					if (this.changes === 0) {
						// No rows were deleted
						return res.status(404).send({
							message: "Task not found",
						});
					}
					res.status(200).send({
						message: "Task successfully updated",
					});
				}
			);
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
