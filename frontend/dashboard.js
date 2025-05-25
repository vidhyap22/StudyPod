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
			<h1 class="card-level">${project.level}</h1>
			<div class="card-inner">
				<img class="base-gus" src="images/base-gus.png" alt="Base Gus">
				<h3 class="gus-name">${project.gus_name}</h3>
				<h3 class="pod-name">${project.project_title}</h3>
				<h3 class="deadline">Due: ${formattedDate}</h3>
			</div>
		`;
		cardsGrid.appendChild(newCard);
	});
}

window.addEventListener("DOMContentLoaded", loadProjects);
