function setupLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const showPasswordBox = document.getElementById("showPassword");

  showPasswordBox.addEventListener("change", function () {
    if (showPasswordBox.checked) {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (email === "" || password === "") {
      showMessage("loginMessage", "Please enter your email and password.", "error");
      return;
    }
    if (email.includes("@") === false || email.includes(".") === false) {
      showMessage("loginMessage", "Please enter a valid email address.", "error");
      return;
    }

    const user = findAccountByEmail(email);
    if (user === null) {
      showMessage("loginMessage", "No account found with that email. Please register first or use a demo account.", "error");
      return;
    }
    if (user.password !== password) {
      showMessage("loginMessage", "Incorrect password. Please try again.", "error");
      return;
    }

    saveToStorage("eventEaseUser", removePassword(user));
    localStorage.setItem("eventEaseLoggedIn", "yes");

    if (user.accountType === "organizer") {
      window.location.href = "organizer-dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }
  });
}

function setupRegisterPage() {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const accountType = document.getElementById("accountType").value;

    if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
      showMessage("registerMessage", "Please fill in all fields.", "error");
      return;
    }
    if (email.includes("@") === false || email.includes(".") === false) {
      showMessage("registerMessage", "Please enter a valid email address.", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("registerMessage", "Password must be at least 6 characters.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showMessage("registerMessage", "Passwords do not match.", "error");
      return;
    }

    if (findDemoAccount(email) !== null) {
      showMessage("registerMessage", "That email is used by a demo account. Please use another email.", "error");
      return;
    }
    const accounts = getFromStorage("eventEaseAccounts", []);
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].email === email) {
        showMessage("registerMessage", "An account with this email already exists. Please login.", "error");
        return;
      }
    }

    const newUser = {
      name: fullName,
      email: email,
      password: password,
      accountType: accountType,
      program: ""
    };
    accounts.push(newUser);
    saveToStorage("eventEaseAccounts", accounts);

    showMessage("registerMessage", "Account created! Taking you to the login page...", "success");
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);
  });
}

if (currentPage === "page-login") {
  setupLoginPage();
} else if (currentPage === "page-register") {
  setupRegisterPage();
}
