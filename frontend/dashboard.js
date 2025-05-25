async function loadProjects() {
	const res = await fetch("http://127.0.0.1:5000/project/get-all-projects", {
		method: "GET",
		credentials: "include" // Send cookies for JWT
	});

	const grid = document.querySelector(".cards-grid");

	if (!res.ok) {
		grid.innerHTML = "<p>Failed to load your Guses. Please try again.</p>";
		return;
	}

	const projects = await res.json();

	if (projects.length === 0) {
		grid.innerHTML = "<p>You have no active Guses. Create one to get started!</p>";
		return;
	}

	// Clear the grid and render each project as a card
	grid.innerHTML = "";
	projects.forEach(project => {
		const card = document.createElement("div");
		card.className = "main-card grow-on-hover";
		card.innerHTML = `
			<h3>${project.project_title}</h3>
			<p><strong>Gus Name:</strong> ${project.gus_name}</p>
			<p><strong>Level:</strong> ${project.level}</p>
			<p><strong>Deadline:</strong> ${project.deadline ? project.deadline.split("T")[0] : "None"}</p>
		`;
		grid.appendChild(card);
	});
}

window.addEventListener("DOMContentLoaded", loadProjects);
