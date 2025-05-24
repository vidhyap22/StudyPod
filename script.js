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
		categories: ["Agathario Gus", "Glee Gus", "Yaoi Podcast Gus"],
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


document.getElementById("add-pod-form").addEventListener("submit", function(e) {
	e.preventDefault();
	const gusName = document.getElementById("gusname").value;
	const podName = document.getElementById("podname").value;
	const users = document.getElementById("users").value.split(",").map(u => u.trim());


	addPodCard(gusName, podName);

	this.reset();
	closeForm();
});

function addPodCard(gusName, podName, level = 0) {
	gusName = gusName || "My Gus";
	podName = podName || "My Study Pod";

	const cardsGrid = document.querySelector(".cards-grid");
	const newCard = document.createElement("div");
	newCard.classList.add("card-wrapper", "grow-on-hover");
	
	newCard.innerHTML = `
		<h1 class="card-level">${level}</h1>
		<div class="card-inner">
			<div class="gus-img"></div>
			<h3 class="gus-name">${gusName}</h3>
			<h3 class="pod-name">${podName}</h3>
		</div>
	`;

	cardsGrid.appendChild(newCard);
};

