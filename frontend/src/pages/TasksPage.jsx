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

	function checkTask(id) {
		if (id) {
			axios
				.put(`http://localhost:3000/tasks/${id}`)
				.then((res) => {
					console.log("It has been updated sir");
					console.log(res.data);
				})
				.catch((error) => {
					console.log("Put a helpful error message here");
				});
		}
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
										<div className="form-check form-check-inline">
											<input
												className="form-check-input"
												type="checkbox"
												value="true"
												id="flexCheckDefault"
												checked={task.done === 1}
												onChange={() => {
													checkTask(task.id);
												}}
											/>
											<label
												className="form-check-label"
												htmlFor="flexCheckDefault"
											>
												{task.name}
											</label>
										</div>
									</div>
								</div>
							))}
							<button
								className="btn btn-primary"
								onClick={() => setModalVisible(true)}
							>
								Add another
							</button>
						</div>
					) : (
						<div className="d-flex justify-content-center">
							<div className="spinner-border" role="status">
								<span className="visually-hidden">
									Loading...
								</span>
							</div>
						</div>
					)}
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
