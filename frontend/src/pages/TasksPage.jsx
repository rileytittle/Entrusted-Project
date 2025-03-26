import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function TasksPage() {
	const [tasks, setTasks] = useState([]);
	useEffect(() => {
		axios
			.get("http://localhost:3000/tasks")
			.then((res) => {
				setTasks(res.rows);
			})
			.catch((error) => {
				//handle the error
			});
	});
	return (
		<div>
			{tasks.map((task) => (
				<p>
					{task.id}, {task.name}, {task.done}
				</p>
			))}
		</div>
	);
}

export default TasksPage;
