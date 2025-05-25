window.addEventListener("DOMContentLoaded", loadProjectDetails);

async function loadProjectDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	const projectId = urlParams.get("project_id");

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
        document.getElementById("due-date").textContent = formattedDate;
		document.getElementById("project-title").textContent = project.project_title;
		document.getElementById("gus-name").textContent = project.gus_name;
		document.getElementById("gus-level").textContent = `Level: ${project.level}`;
	} catch (error) {
		console.error("Error loading project:", error);
	}
}
