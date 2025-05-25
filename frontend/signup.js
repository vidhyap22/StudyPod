document.getElementById("signup-form").addEventListener("submit", async (event) => {
	event.preventDefault();

	const username = document.getElementById("signup-username").value;
	const password = document.getElementById("signup-password").value;

	const response = await fetch("http://127.0.0.1:5000/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	const data = await response.json();

	if (response.ok) {
		alert("Signup successful! Redirecting to login...");
        console.log("should redirect now");
		window.location.href = "login.html"; // ✅ simple relative path
	} else {
		alert(data.msg || "Signup failed.");
	}
});
