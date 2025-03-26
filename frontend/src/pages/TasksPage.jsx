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
		<div className="card">
			<div className="card-body">
				<h5 className="card-title">Tasks</h5>
				{tasks.length > 0 ? (
					<div>
						{tasks.map((task) => (
							<div className="card mb-3" key={task.id}>
								<div className="card-body">
									{task.id}, {task.name}, {task.done}
								</div>
							</div>
						))}
					</div>
				) : (
					<p>Tasks loading</p>
				)}
				<a href="#" class="btn btn-primary">
					Add another
				</a>
			</div>
		</div>
	);
}

export default TasksPage;
