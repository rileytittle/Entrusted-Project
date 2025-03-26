import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function TasksPage() {
	const [tasks, setTasks] = useState([]);
	useEffect(() => {
		axios
			.get("http://localhost:3000/tasks")
			.then((res) => {
				setTasks(res.data);
			})
			.catch((error) => {
				//handle the error
			});
	});
	return (
		<div>
			{tasks.length > 0 ? (
				<div>
					{tasks.map((task) => (
						<div key={task.id}>
							<p>
								{task.id}, {task.name}, {task.done}
							</p>
						</div>
					))}
				</div>
			) : (
				<p>Tasks loading</p>
			)}
		</div>
	);
}

export default TasksPage;
