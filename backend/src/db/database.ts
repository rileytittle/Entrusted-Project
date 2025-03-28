import sqlite3 from "sqlite3";
import path from "path";

//obtain the correct path to the sqlite3 file
const dbPath = path.resolve(__dirname, "../../tasks.sqlite3");

//enable verbose mode for debugging
sqlite3.verbose();

//connect to the sqlite3 database
const db = new sqlite3.Database(dbPath, (e: Error | null) => {
	if (e) {
		console.error("Error opening database:", e.message);
	} else {
		console.log("Connected to SQLite database.");

		db.run(
			`
			CREATE TABLE IF NOT EXISTS tasks (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				done BOOLEAN DEFAULT FALSE
			);`,
			(error) => {
				if (error) {
					console.log("Error creating new table");
				} else {
					console.log("Query successful");
				}
			}
		);
	}
});

export default db;
