window.addEventListener("DOMContentLoaded", loadTasks);

function addTaskFromObject(task_obj) {
	const listContainer = document.getElementById("list-container");

	const li = document.createElement("li");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.value = task_obj["task_id"];

	const label = document.createElement("label");
	const span = document.createElement("span");
	span.textContent = task_obj["task_name"];

	checkbox.checked = !!task_obj["is_completed"];
	if (task_obj["is_completed"]) {
		checkbox.checked = true;
		li.classList.add("completed");
	}

	label.appendChild(checkbox);
	label.appendChild(span);
	li.appendChild(label);
	listContainer.appendChild(li);

	checkbox.addEventListener("click", completeTask);
}

async function loadTasks() {
	const res = await fetch(`http://127.0.0.1:5000/task/get_tasks_from_project_id?project_id=${1}`, {
		method: "GET",
		credentials: "include",
	});
	let tasks = await res.json();
	console.log(tasks);
	tasks.forEach((task) => {
		addTaskFromObject(task);
	});
}

async function addTask() {
	const inputBox = document.getElementById("input-box");

	const task_name = inputBox.value.trim();
	if (!task_name) {
		alert("Please write down a Task");
		return;
	}

	await addNewTaskToDatabase(task_name, 1); // TODO: replace 1 with actual project_id query param
	const listContainer = document.getElementById("list-container");
	listContainer.replaceChildren();
	await loadTasks();
}

async function addNewTaskToDatabase(task_name, project_id) {
	const res = await fetch(`http://127.0.0.1:5000/task/create-task`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			task_name: task_name,
			project_id: project_id,
			is_completed: false,
		}),
	});

	if (res.ok) {
		const result = await res.json();
		console.log("Task created:", result);
	} else {
		console.error("Failed to create task:", res.statusText);
	}
}

async function completeTask(event) {
	const checkbox = event.target;
	const taskId = checkbox.value;
	console.log("task", taskId);
	const res = await fetch(`http://127.0.0.1:5000/task/mark-task-completed`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			task_id: taskId,
            project_id: 1 // TODO: replace with real project_id
		}),
	});

	if (res.ok) {
		const result = await res.json();
		console.log("Task completed:", result);
	} else {
		console.error("Failed to complete task:", res.statusText);
	}
}
