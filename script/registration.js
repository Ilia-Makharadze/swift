document.getElementById("toLogin").addEventListener("click", function (e) {
    e.preventDefault();
    toggleForms("login");
});

document.getElementById("toRegister").addEventListener("click", function (e) {
    e.preventDefault();
    toggleForms("register");
});

function toggleForms(formType) {
    document.getElementById("registrationForm").style.display = formType === "login" ? "none" : "block";
    document.getElementById("loginForm").style.display = formType === "register" ? "none" : "block";
}


async function registrationSubmit() {
    let firstname = document.getElementById("firstname").value.trim();
    let lastname = document.getElementById("lastname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let resultContainer = document.querySelector(".res");

    if (!firstname || !lastname || !email || !password) {
        resultContainer.innerHTML = `<p style="color: red;">All fields are required.</p>`;
        return;
    }

    let user = { firstname, lastname, email, password };
    
    try {
        let response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        let data = await response.json();
        if (response.ok) {
            resultContainer.innerHTML = `<p style="color: green;">${data.message}</p>`;
            setTimeout(() => toggleForms("login"), 1000);
        } else {
            resultContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: red;">Server error.</p>`;
    }
}


async function loginSubmit() {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let resultContainer = document.querySelector(".res1");

    if (!email || !password) {
        resultContainer.innerHTML = `<p style="color: red;">All fields are required.</p>`;
        return;
    }

    let user = { email, password };

    try {
        let response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        let data = await response.json();
        if (response.ok) {
            resultContainer.innerHTML = `<p style="color: green;">${data.message}</p>`;
            localStorage.setItem("token", data.token);
            setTimeout(() => (window.location.href = "main.html"), 1000);
        } else {
            resultContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: red;">Server error.</p>`;
    }
}
