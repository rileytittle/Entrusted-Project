import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function TasksPage() {
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("-1");
	const [modalVisible, setModalVisible] = useState(false);
	const [newTaskName, setNewTaskName] = useState("");
	const [loading, setLoading] = useState(true);
	const [errorOccurred, setErrorOccurred] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	function createTask() {
		if (newTaskName) {
			axios
				.post(
					"http://localhost:3000/tasks",
					{
						task_name: newTaskName,
					},
					{
						headers: {
							"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
						},
					}
				)
				.then((res) => {
					setErrorMessage("");
					setErrorOccurred(false);
				})
				.catch((error) => {
					setErrorMessage("There was a problem creating a new task.");
					setErrorOccurred(true);
				});
			setNewTaskName("");
		}
		setModalVisible(false);
	}

	function checkTask(id) {
		if (id) {
			axios
				.put(
					`http://localhost:3000/tasks/${id}`,
					{},
					{
						headers: {
							"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
						},
					}
				)
				.then((res) => {
					setErrorMessage("");
					setErrorOccurred(false);
				})
				.catch((error) => {
					setErrorMessage(
						"There was a problem updating the task's status."
					);
					setErrorOccurred(true);
				});
		}
	}

	function deleteTask(id) {
		if (id) {
			axios
				.delete(`http://localhost:3000/tasks/${id}`, {
					headers: {
						"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
					},
				})
				.then((res) => {
					setErrorMessage("");
					setErrorOccurred(false);
				})
				.catch((error) => {
					setErrorMessage("There was a problem deleting the task.");
					setErrorOccurred(true);
				});
		}
	}
	useEffect(() => {
		axios
			.get("http://localhost:3000/tasks", {
				headers: {
					"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
				},
			})
			.then((res) => {
				if (filter === "-1") {
					setTasks(res.data);
				} else {
					setTasks(
						res.data.filter(
							(task) => task.done === parseInt(filter)
						)
					);
				}
				setLoading(false);
				setErrorOccurred(false);
			})
			.catch((error) => {
				setLoading(false);
				setErrorOccurred(true);
				//handle the error
			});
	});

	return (
		<>
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">Tasks</h5>
					<select
						className="form-select w-auto"
						value={filter}
						onChange={(e) => {
							setFilter(e.target.value);
						}}
					>
						<option value="-1">All Tasks</option>
						<option value="0">Incomplete Tasks</option>
						<option value="1">Completed Tasks</option>
					</select>
					{loading ? (
						<div className="d-flex justify-content-center">
							<div className="spinner-border" role="status">
								<span className="visually-hidden">
									Loading...
								</span>
							</div>
						</div>
					) : (
						<div>
							{tasks.length > 0 ? (
								<div>
									{tasks.map((task) => (
										<div
											className="card mb-3 mt-3"
											key={task.id}
										>
											<div className="card-body d-flex justify-content-between align-items-center">
												<div className="form-check form-check-inline">
													<input
														className="form-check-input"
														type="checkbox"
														value="true"
														id="flexCheckDefault"
														checked={
															task.done === 1
														}
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
												<button
													type="button"
													className="btn btn-danger"
													onClick={() => {
														deleteTask(task.id);
													}}
												>
													Delete
												</button>
											</div>
										</div>
									))}
								</div>
							) : (
								<p>No tasks to display</p>
							)}
							<button
								className="btn btn-primary"
								onClick={() => setModalVisible(true)}
							>
								Add another
							</button>
						</div>
					)}
					{errorOccurred ? (
						<p>This should only show if an api error occurred</p>
					) : (
						<></>
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
