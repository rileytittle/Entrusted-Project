import { useState } from "react";
import TasksPage from "./pages/TasksPage";
import LoginPage from "./pages/LoginPage";

function App() {
	function checkIfLoggedIn() {
		const token = sessionStorage.getItem("authToken");
		if (!token) {
			return false;
		} else {
			return true;
		}
	}
	return (
		<>
			{checkIfLoggedIn() ? (
				<TasksPage></TasksPage>
			) : (
				<LoginPage></LoginPage>
			)}
		</>
	);
}

export default App;
