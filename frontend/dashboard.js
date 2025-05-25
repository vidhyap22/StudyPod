async function loadProjects() {
	const res = await fetch("http://127.0.0.1:5000/project/get-all-projects", {
		method: "GET",
		credentials: "include" // Send cookies for JWT
	});

	const cardsGrid = document.querySelector(".cards-grid");

	if (!res.ok) {
		cardsGrid.innerHTML = "<p>Failed to load your Guses. Please try again.</p>";
		return;
	}

	const projects = await res.json();

	if (projects.length === 0) {
		cardsGrid.innerHTML = "<p>You have no active Guses. Create one to get started!</p>";
		return;
	}

	// Clear the grid and render each project as a card
	cardsGrid.innerHTML = "";
	projects.forEach(project => {
		const newCard = document.createElement("div");
		newCard.classList.add("card-wrapper", "grow-on-hover");
		//newCard.className = "main-card grow-on-hover";
		
		const rawDate = project.deadline;
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
				<h3 class="gus-name">${project.gus_name}</h3>
				<h3 class="pod-name">${project.project_title}</h3>
				<h3 class="deadline">Due: ${formattedDate}</h3>
			</div>
		`;

		// newCard.addEventListener('click', () => {
		// 	window.location.href = "http://127.0.0.1:5500/frontend/studypod.html";
		// });

		newCard.addEventListener('click', () => {
			window.location.href = `http://127.0.0.1:5500/frontend/studypod.html?project_id=${project.project_id}`;
		});
		newCard.dataset.projectId = project.project_id;

		cardsGrid.appendChild(newCard);
	});

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

			console.log(completed, total)

			countEl.textContent = `${completed}/${total} tasks completed`;
		} catch (e) {
			console.error("Error loading tasks for project:", projectId, e);
			countEl.textContent = "Error loading tasks";
		}
	}
 }

 
window.addEventListener("DOMContentLoaded", loadProjects);
