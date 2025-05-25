document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://127.0.0.1:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // Required to send cookies
            body: JSON.stringify({ username, password })
        });


        const data = await res.json();
        if (res.ok) {
            alert("Login successful!");
            window.location.href = "/dashboard.html"; // or your actual page
        } else {
            alert(data.message || "Login failed.");
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("Login failed due to a network error.");
    }
});
