import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./TasksPage.css";

function TasksPage() {
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("-1");
	const [newTaskName, setNewTaskName] = useState("");
	const [loading, setLoading] = useState(true);
	const [errorOccurred, setErrorOccurred] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [deletingCard, setDeletingCard] = useState(null);
	const [creatingCard, setCreatingCard] = useState(null);
	function createTask() {
		if (newTaskName) {
			{
				axios
					.post(
						"http://localhost:3000/tasks",
						{
							name: newTaskName,
						},
						{
							headers: {
								"x-api-key":
									"5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
							},
						}
					)
					.then((res) => {
						setErrorMessage("");
						setCreatingCard(res.data.id);
						setErrorOccurred(false);
						setTimeout(() => {
							setCreatingCard(null);
						}, 205);
						getAllTasks();
					})
					.catch((error) => {
						setErrorOccurred(true);
						if (error.response) {
							setErrorMessage(error.response.data.message);
						}
						if (sessionStorage.getItem("localTasks")) {
							setTasks(
								JSON.parse(sessionStorage.getItem("localTasks"))
							);
						}
					});
				setNewTaskName("");
			}
		}
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
					getAllTasks();
				})
				.catch((error) => {
					setErrorOccurred(true);
					if (error.response) {
						setErrorMessage(error.response.data.message);
					}
					if (sessionStorage.getItem("localTasks")) {
						setTasks(
							JSON.parse(sessionStorage.getItem("localTasks"))
						);
					}
				});
		}
	}

	function deleteTask(id) {
		if (id) {
			setDeletingCard(id);
			setTimeout(() => {
				axios
					.delete(`http://localhost:3000/tasks/${id}`, {
						headers: {
							"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
						},
					})
					.then((res) => {
						setErrorMessage("");
						setErrorOccurred(false);
						getAllTasks();
					})
					.catch((error) => {
						setErrorOccurred(true);
						if (error.response) {
							setErrorMessage(error.response.data.message);
						}
						if (sessionStorage.getItem("localTasks")) {
							setTasks(
								JSON.parse(sessionStorage.getItem("localTasks"))
							);
						}
					});
			}, 300);
		}
	}
	function getAllTasks() {
		axios
			.get("http://localhost:3000/tasks", {
				headers: {
					"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
				},
			})
			.then((res) => {
				sessionStorage.setItem("localTasks", JSON.stringify(res.data));
				console.log(filter);
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
				if (error.response) {
					setErrorMessage(error.response.data.message);
				}
				if (sessionStorage.getItem("localTasks")) {
					setTasks(JSON.parse(sessionStorage.getItem("localTasks")));
				}
			});
	}
	useEffect(() => {
		getAllTasks();
	}, [filter]);

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
											className={`card mb-3 mt-3 ${
												deletingCard === task.id
													? "slide-out"
													: ""
											}${
												creatingCard === task.id
													? "slide-in"
													: ""
											}`}
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
								className="btn btn-primary mb-3"
								data-bs-toggle="modal"
								data-bs-target="#createTaskModal"
							>
								Add another
							</button>
						</div>
					)}
					{errorOccurred ? (
						<div className="alert alert-danger" role="alert">
							{errorMessage}
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="modal fade" id="createTaskModal" tabIndex="-1">
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
								onChange={(e) => setNewTaskName(e.target.value)}
							/>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								Close
							</button>
							<button
								type="button"
								className="btn btn-primary"
								data-bs-dismiss="modal"
								onClick={createTask}
							>
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default TasksPage;
