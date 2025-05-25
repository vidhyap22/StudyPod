let gus_level = 0;
window.addEventListener("DOMContentLoaded", loadProjectDetails);

async function loadProjectDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	const projectId = urlParams.get("project_id");

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
