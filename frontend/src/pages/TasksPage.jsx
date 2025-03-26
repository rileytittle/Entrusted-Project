import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function TasksPage() {
	const [tasks, setTasks] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [newTaskName, setNewTaskName] = useState("");

	function createTask() {
		if (newTaskName) {
			axios
				.post("http://localhost:3000/tasks", {
					task_name: newTaskName,
				})
				.then((res) => {
					console.log("will this cause a re-rendering???");
				})
				.catch((error) => {
					console.log("Error posting new task");
				});
			setNewTaskName("");
		}
		setModalVisible(false);
	}
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
		<>
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
					<button
						className="btn btn-primary"
						onClick={() => setModalVisible(true)}
					>
						Add another
					</button>
				</div>
			</div>
			{modalVisible && (
				<div className="modal fade show" style={{ display: "block" }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Create New Task</h5>
							</div>
							<div className="modal-body">
								<label htmlFor="name">Task name</label>
								<input
									name="name"
									id="name"
									type="text"
									value={newTaskName}
									onChange={(e) =>
										setNewTaskName(e.target.value)
									}
								/>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									data-bs-dismiss="modal"
									onClick={() => {
										setModalVisible(false);
									}}
								>
									Close
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={createTask}
								>
									Save changes
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default TasksPage;
