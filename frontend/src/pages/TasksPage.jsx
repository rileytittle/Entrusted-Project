import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./TasksPage.css";

function TasksPage() {
	//this state holds all the tasks fetched from the backend.
	const [tasks, setTasks] = useState([]);

	//this state is for setting the filter that affects which tasks are displayed
	//and for storing the name to set newly created tasks.
	const [filter, setFilter] = useState("-1");
	const [newTaskName, setNewTaskName] = useState("");

	//this state is for displaying the spinner when fetching tasks
	const [loading, setLoading] = useState(true);

	//these two states are for displaying error messages if the user
	//does something incorrect or the api sends back an error code.
	const [errorOccurred, setErrorOccurred] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	//these two states are for applying a css animation to tasks getting deleted and created.
	const [deletingCard, setDeletingCard] = useState(null);
	const [creatingCard, setCreatingCard] = useState(null);

	/**
	 * createTask sends a http request to the API
	 * to create a new task record in the database.
	 * It then calls get allTasks() to refresh the
	 * task list.
	 */
	function createTask() {
		//if a name was provided in the form, continue
		if (newTaskName) {
			{
				//make http request
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
						//if no error occured, set creatingCard to the id that was returned
						//so that we can apply a css animation
						setCreatingCard(res.data.id);
						//if
						if (res.status >= 400) {
							setErrorOccurred(true);
							setErrorMessage(res.data.message);
						} else {
							setErrorOccurred(false);
							setErrorMessage("");
						}
						setTimeout(() => {
							setCreatingCard(null);
						}, 205);
						getAllTasks();
					})
					.catch((error) => {
						setErrorOccurred(true);
						setErrorMessage(
							"There was a problem sending your request"
						);
						if (sessionStorage.getItem("localTasks")) {
							setTasks(
								JSON.parse(sessionStorage.getItem("localTasks"))
							);
						}
					});
				setNewTaskName("");
			}
		} else {
			//if no name was supplied, alert user
			setErrorOccurred(true);
			setErrorMessage("You must enter a name for the task");
		}
	}

	/**
	 * checkTask sends a request to the api to check or uncheck
	 * a task. It sends the id of the task as a parameter.
	 * It then calls getAllTasks() to refresh the list.
	 */
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
					if (res.status >= 400) {
						setErrorOccurred(true);
						setErrorMessage(res.data.message);
					} else {
						setErrorOccurred(false);
						setErrorMessage("");
					}
					getAllTasks();
				})
				.catch((error) => {
					setErrorOccurred(true);
					setErrorMessage("There was a problem sending your request");
					if (sessionStorage.getItem("localTasks")) {
						setTasks(
							JSON.parse(sessionStorage.getItem("localTasks"))
						);
					}
				});
		}
	}
	/**
	 * deleteTask sends a request to the api to delete a check.
	 * It sends the id of the task as a parameter.
	 * It then calls getAllTasks() to refresh the list.
	 */
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
						if (res.status >= 400) {
							setErrorOccurred(true);
							setErrorMessage(res.data.message);
						} else {
							setErrorOccurred(false);
							setErrorMessage("");
						}
						getAllTasks();
					})
					.catch((error) => {
						setErrorOccurred(true);
						setErrorMessage(
							"There was a problem sending your request"
						);
						if (sessionStorage.getItem("localTasks")) {
							setTasks(
								JSON.parse(sessionStorage.getItem("localTasks"))
							);
						}
					});
			}, 300);
		}
	}
	/**
	 * getAllTasks sends a http request to get all the tasks from
	 * the API. The spinner is set to true by default so this function also sets
	 * the spinner to false, so that when the call is done, whether it
	 * succeeds or fails, the spinner goes away.
	 * It also sets the local copy of the tasks to the version in state,
	 * so that if the API has a critical failure and every call to it fails,
	 * the result of the most recent successful call of getAllTasks is stored in
	 * local storage and tasks is set to it.
	 * This function also checks the current filter and filters the array of tasks
	 * according to it.
	 */
	function getAllTasks() {
		axios
			.get("http://localhost:3000/tasks", {
				headers: {
					"x-api-key": "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e",
				},
			})
			.then((res) => {
				sessionStorage.setItem("localTasks", JSON.stringify(res.data));
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
				if (res.status >= 400) {
					setErrorOccurred(true);
					setErrorMessage(res.data.message);
				} else {
					setErrorOccurred(false);
					setErrorMessage("");
				}
			})
			.catch((error) => {
				setLoading(false);
				setErrorOccurred(true);
				setErrorMessage("There was a problem sending your request");
				if (sessionStorage.getItem("localTasks")) {
					setTasks(JSON.parse(sessionStorage.getItem("localTasks")));
					if (filter != "-1") {
						setTasks(
							tasks.filter(
								(task) => task.done === parseInt(filter)
							)
						);
					}
				}
			});
	}
	/**
	 * useEffect is a react supplied hook that executes when the component is
	 * first mounted and, because of the dependency array, every time the state of
	 * the filter changes.
	 * All it is doing is calling the getAllTasks() function.
	 */
	useEffect(() => {
		getAllTasks();
	}, [filter]);

	return (
		<>
			<div className="card">
				<div className="card-body">
					<h5 className="card-title">Tasks</h5>
					{errorOccurred ? (
						<div className="alert alert-danger" role="alert">
							{errorMessage}
						</div>
					) : (
						<></>
					)}
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
														id="taskCheckbox"
														checked={
															task.done === 1
														}
														onChange={() => {
															checkTask(task.id);
														}}
													/>
													<label
														className="form-check-label"
														htmlFor="taskCheckbox"
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
								Add Task
							</button>
						</div>
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
							<label className="new-task-label" htmlFor="name">
								Task name
							</label>
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
