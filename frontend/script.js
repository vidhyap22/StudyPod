const barChartOptions = {
	series: [
		{
			data: [8, 10, 13],
			name: "Gus Levels",
		},
	],
	chart: {
		type: "bar",
		background: "transparent",
		height: 350,
		toolbar: {
			show: false,
		},
	},
	colors: ["#f4e8ff95", "#fff4de95", "#ffe2e690"],
	plotOptions: {
		bar: {
			distributed: true,
			borderRadius: 4,
			horizontal: false,
			columnWidth: "40%",
		},
	},
	dataLabels: {
		enabled: false,
	},
	fill: {
		opacity: 1,
	},
	grid: {
		borderColor: "#ccc",
		yaxis: {
			lines: {
				show: true,
			},
		},
		xaxis: {
			lines: {
				show: true,
			},
		},
	},
	legend: {
		labels: {
			colors: "#000",
		},
		show: true,
		position: "top",
	},
	stroke: {
		colors: ["transparent"],
		show: true,
		width: 2,
	},
	tooltip: {
		shared: true,
		intersect: false,
		theme: "dark",
	},
	xaxis: {
		categories: ["161 Midterm", "ICS 53 Project", "Podcast Project"],
		title: {
			style: {
				color: "#000",
			},
		},
		axisBorder: {
			show: true,
			color: "#000",
		},
		axisTicks: {
			show: true,
			color: "#000",
		},
		labels: {
			style: {
				colors: "#000",
			},
		},
	},
	yaxis: {
		title: {
			text: "Levels",
			style: {
				color: "#000",
			},
		},
		axisBorder: {
			color: "#000",
			show: true,
		},
		axisTicks: {
			color: "#000",
			show: true,
		},
		labels: {
			style: {
				colors: "#000",
			},
		},
	},
};

const barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();

const completionPieOptions = {
	series: [80, 20], //
	chart: {
		type: "pie",
		height: 300,
	},
	labels: ["Complete", "Remaining"],
	colors: ["#5e60ef", "#e0e0e0"],
	dataLabels: {
		enabled: false,
		style: {
			colors: ["#000"],
			fontWeight: "bold",
		},
	},
	legend: {
		labels: {
			colors: "#000",
		},
		position: "bottom",
	},
	tooltip: {
		enabled: true,
		theme: "light",
	},
	plotOptions: {
		pie: {
			donut: {
				size: "70%",
				labels: {
					show: true,
					name: {
						show: true,
					},
					value: {
						show: true,
					},
				},
			},
		},
	},
};

var pieChart = new ApexCharts(document.querySelector("#pie-chart"), completionPieOptions);
pieChart.render();

function openForm() {
	document.getElementById("formOverlay").style.display = "flex";
}

function closeForm() {
	document.getElementById("formOverlay").style.display = "none";
}

// document.getElementById("add-pod-form").addEventListener("submit", function (e) {
// 	e.preventDefault();
// 	const gusName = document.getElementById("gusname").value;
// 	const podName = document.getElementById("podname").value;

// 	const deadline = document.getElementById("deadline").value;
// 	const usernames = document.getElementById("users").value.split(",").map(u => u.trim());



// 	addPodCard(gusName, podName, deadline, 0);

// 	this.reset();
// 	closeForm();
// });


document.getElementById("add-pod-form").addEventListener("submit", async function (e) {
	e.preventDefault();

	const gusName = document.getElementById("gusname").value;
	const podName = document.getElementById("podname").value;
	const deadline = document.getElementById("deadline").value;
	const usernames = document.getElementById("users").value.split(",").map(u => u.trim());

	// Optional: Get token if using authentication
	const token = localStorage.getItem("token");

	try {
		const response = await fetch("http://127.0.0.1:5000/project/create-project", {
			
			method: "POST",
			headers: {
				"Content-Type": "application/json"
				// "Authorization": `Bearer ${token}`
			},
			credentials: "include",
			body: JSON.stringify({
				project_title: podName,
				gus_name: gusName,
				level: 0,
				deadline: deadline,
				is_active: 1,
				usernames: usernames
			})
		});

		if (!response.ok) {
			console.log("response is not ok")
			const result = await response.json();
			alert(`Error: ${result.msg}`);
			return;
		}

		const result = await response.json();
		const newProjectId = result.project_id;
		console.log(gusName, podName, deadline, newProjectId)

		addPodCard(gusName, podName, deadline, 0, newProjectId);
		this.reset();
		closeForm();
		// loadProjects();

		// await response.json();
		// // Refresh the full list instead of just adding one manually
		// await loadProjects();
		// this.reset();
		// closeForm();
		
	} catch (error) {
		console.error("Error creating pod:", error);
		alert("Something went wrong while creating the pod.");
	}
});


function addPodCard(gusName, podName, deadline, level = 0, projectId = null) {
	gusName = gusName || "My Gus";
	podName = podName || "My Study Pod";

	const cardsGrid = document.querySelector(".cards-grid");
	const newCard = document.createElement("div");
	newCard.classList.add("card-wrapper", "grow-on-hover");
	//newCard.className = "main-card grow-on-hover";

	const rawDate = deadline;
	const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}) : "None";

	newCard.innerHTML = `
		<div class="card-header">
			<h1 class="card-level">Level: ${project.level}</h1>
			<h3 class="tasks-completed">Loading...</h3>
		</div>

		<div class="card-inner">
			<img class="base-gus" src="images/base-gus.png" alt="Base Gus">
			<h3 class="gus-name">${gusName}</h3>
			<h3 class="pod-name">${podName}</h3>
			<h3 class="deadline">Due: ${formattedDate}</h3>
		</div>
	`;

	// newCard.addEventListener('click', () => {
	// 	window.location.href = "http://127.0.0.1:5500/frontend/studypod.html";
	// });

	newCard.addEventListener('click', () => {
		if (projectId) {
			window.location.href = `http://127.0.0.1:5500/frontend/studypod_right.html?project_id=${projectId}`;
		} else {
			console.warn("No project ID provided");
		}
	});

	newCard.dataset.projectId = projectId;
	cardsGrid.appendChild(newCard);

	loadCompletedTaskCounts();
}

async function loadCompletedTaskCounts() {
	const cards = document.querySelectorAll(".card-wrapper");
	for (const card of cards) {
		const projectId = card.dataset.projectId;
		const countEl = card.querySelector(".tasks-completed");
		try {
			const res = await fetch(`http://127.0.0.1:5000/task/get_total_tasks_completed?project_id=${projectId}`, {
				credentials: "include"
			});
			const data = await res.json();
			const {completed, total} = data;
			countEl.textContent = `${completed}/${total} tasks completed`;
		} catch (e) {
			console.error("Error loading tasks for project:", projectId, e);
			countEl.textContent = "Error loading tasks";
		}
	}
 }
 


// async function loadProjects() {
// 	const res = await fetch("http://127.0.0.1:5000/project/get-all-projects", {
// 		method: "GET",
// 		credentials: "include" // Send cookies for JWT
// 	});

// 	const cardsGrid = document.querySelector(".cards-grid");

// 	if (!res.ok) {
// 		cardsGrid.innerHTML = "<p>Failed to load your Guses. Please try again.</p>";
// 		return;
// 	}

// 	const projects = await res.json();
// 	console.log(projects)
// 	if (projects.length === 0) {
// 		cardsGrid.innerHTML = "<p>You have no active Guses. Create one to get started!</p>";
// 		return;
// 	}

// 	// Clear the grid and render each project as a card
// 	cardsGrid.innerHTML = "";
// 	projects.forEach(project => {
// 		const newCard = document.createElement("div");
// 		newCard.classList.add("card-wrapper", "grow-on-hover");
// 		//newCard.className = "main-card grow-on-hover";
		
// 		const rawDate = project.deadline;
// 		const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
// 			year: 'numeric',
// 			month: 'long',
// 			day: 'numeric'
// 		}) : "None";

// 		newCard.innerHTML = `
// 			<h1 class="card-level">Level: ${project.level}</h1>
// 			<div class="card-inner">
// 				<img class="base-gus" src="images/base-gus.png" alt="Base Gus">
// 				<h3 class="gus-name">${project.gus_name}</h3>
// 				<h3 class="pod-name">${project.project_title}</h3>
// 				<h3 class="deadline">Due: ${formattedDate}</h3>
// 			</div>
// 		`;

// 		// newCard.addEventListener('click', () => {
// 		// 	window.location.href = "http://127.0.0.1:5500/frontend/studypod.html";
// 		// });

// 		newCard.addEventListener('click', () => {
// 			window.location.href = `http://127.0.0.1:5500/frontend/studypod.html?project_id=${project.project_id}`;
// 		});

// 		cardsGrid.appendChild(newCard);
// 	});
// }

// window.addEventListener("DOMContentLoaded", loadProjects);


function addTask() {
	const inputBox = document.getElementById("input-box");
	const listContainer = document.getElementById("list-container");

	const task = inputBox.value.trim();
	if (!task) {
		alert("Please write down a Task");
		return;
	}

	const li = document.createElement("li");
	li.innerHTML = `
		<label>
		<input type="checkbox">
		<span>${task}</span>
		</label>
		`;

	listContainer.appendChild(li);

	inputBox.value = " ";

	const checkbox = li.querySelector("input");

	checkbox.addEventListener("click", function () {
		li.classList.toggle("completed", checkbox.checked);
		updateCounters();
	});
}
