let gus_level = 0;
let projectId = 0;
window.addEventListener("DOMContentLoaded", loadWindow());

function loadWindow() {
	loadProjectDetails();
	loadTasks();
}
async function loadProjectDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	projectId = urlParams.get("project_id");

	let level_gus_image = {};

	level_gus_image[0] = "images/gus-rug.png"
	level_gus_image[1] = "images/gus_level_1.PNG"
	level_gus_image[2] = "images/gus_level_2.PNG"
	level_gus_image[3] = "images/gus_level_3.PNG"
	level_gus_image[4] = "images/gus_level_4.PNG"
	level_gus_image[5] = "images/gus_level_5.PNG"

	if (!projectId) {
		console.error("No project_id in URL");
		return;
	}

	try {
		const response = await fetch(`http://127.0.0.1:5000/project/get-project?project_id=${projectId}`, {
			method: "GET",
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error("Failed to fetch project");
		}

		const project = await response.json();

		// Populate elements by ID
        const rawDate = project.deadline;
        const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : "None";
        document.getElementById("due-date").textContent = document.getElementById("due-date").textContent = "Due Date: " + formattedDate;
		document.getElementById("project-title").textContent = project.project_title;
		document.getElementById("gus-name").textContent = "Hi my name is " + project.gus_name + "!";
		gus_level = project.level;
		document.getElementById("gus-level").textContent = `Level: ${gus_level}`;

		//.getElementById("gus-level").textContent = `Level: ${gus_level}`;

		let gus_img_element = document.getElementById("character-img")
		gus_img_element.src= level_gus_image[gus_level]

	} catch (error) {
		console.error("Error loading project:", error);
	}
}

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
	const res = await fetch(`http://127.0.0.1:5000/task/get_tasks_from_project_id?project_id=${projectId}`, {
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

	await addNewTaskToDatabase(task_name, projectId);
	const listContainer = document.getElementById("list-container");
	listContainer.replaceChildren();
	await loadTasks();
	await loadProjectDetails();
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

	const res = await fetch(`http://127.0.0.1:5000/task/mark-task-completed`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			task_id: taskId,
            project_id: projectId
		}),
	});

	if (res.ok) {
		const result = await res.json();
		console.log("Task completed:", result);
		await loadProjectDetails();
	} else {
		console.error("Failed to complete task:", res.statusText);
	}
}
