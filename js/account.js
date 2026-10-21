function setupNotificationsPage() {
  showNotifications();

  document.getElementById("markAllButton").addEventListener("click", function () {
    const allIds = [];
    for (let i = 0; i < sampleNotifications.length; i++) {
      allIds.push(sampleNotifications[i].id);
    }
    saveToStorage("eventEaseReadNotifications", allIds);
    showNotifications();
  });
}

function showNotifications() {
  const readIds = getReadNotificationIds();
  const notificationList = document.getElementById("notificationList");
  let html = "";
  let unreadCount = 0;

  for (let i = 0; i < sampleNotifications.length; i++) {
    const notification = sampleNotifications[i];
    const isRead = readIds.includes(notification.id);
    if (isRead === false) {
      unreadCount = unreadCount + 1;
    }

    if (isRead) {
      html += '<div class="card notification-item">';
    } else {
      html += '<div class="card notification-item unread">';
    }
    html += '<span class="badge">' + notification.type + "</span>";
    html += "<p>" + notification.message + "</p>";
    html += '<p class="muted">' + notification.time + "</p>";
    if (isRead === false) {
      html += '<button class="btn btn-outline btn-small read-button" data-id="' + notification.id + '">Mark as read</button>';
    }
    html += "</div>";
  }

  notificationList.innerHTML = html;
  document.getElementById("unreadCount").textContent = unreadCount + " unread";

  const readButtons = document.querySelectorAll(".read-button");
  for (let i = 0; i < readButtons.length; i++) {
    readButtons[i].addEventListener("click", function () {
      const notificationId = Number(readButtons[i].getAttribute("data-id"));
      const updatedReadIds = getReadNotificationIds();
      updatedReadIds.push(notificationId);
      saveToStorage("eventEaseReadNotifications", updatedReadIds);
      showNotifications();
    });
  }
}

function setupProfilePage() {
  const user = getCurrentUser();
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profileProgram").textContent = user.program;
  if (user.program === "") {
    document.getElementById("profileProgram").textContent = "Not set";
  }
  if (user.accountType === "organizer") {
    document.getElementById("profileType").textContent = "Organizer";
  } else {
    document.getElementById("profileType").textContent = "Student";
  }

  const registrations = getVisibleRegistrations();
  let confirmedCount = 0;
  let cancelledCount = 0;
  for (let i = 0; i < registrations.length; i++) {
    if (registrations[i].status === "Confirmed") {
      confirmedCount = confirmedCount + 1;
    } else {
      cancelledCount = cancelledCount + 1;
    }
  }
  document.getElementById("statRegistrations").textContent = confirmedCount;
  document.getElementById("statCancelled").textContent = cancelledCount;
  document.getElementById("statFavorites").textContent = getFavoriteIds().length;
}

function setupEditProfilePage() {
  const user = getCurrentUser();
  document.getElementById("editName").value = user.name;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editProgram").value = user.program;
  if (findDemoAccount(user.email) !== null) {
    document.getElementById("editEmail").readOnly = true;
  }

  document.getElementById("editProfileForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const newName = document.getElementById("editName").value.trim();
    const newEmail = document.getElementById("editEmail").value.trim().toLowerCase();
    const newProgram = document.getElementById("editProgram").value.trim();

    if (newName === "" || newEmail === "") {
      showMessage("editMessage", "Name and email cannot be empty.", "error");
      return;
    }
    if (newEmail.includes("@") === false || newEmail.includes(".") === false) {
      showMessage("editMessage", "Please enter a valid email address.", "error");
      return;
    }

    const accounts = getFromStorage("eventEaseAccounts", []);
    if (newEmail !== user.email && findAccountByEmail(newEmail) !== null) {
      showMessage("editMessage", "That email is already used by another account.", "error");
      return;
    }

    let found = false;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].email === user.email) {
        accounts[i].name = newName;
        accounts[i].email = newEmail;
        accounts[i].program = newProgram;
        found = true;
      }
    }
    if (found === false) {
      const demoAccount = findDemoAccount(user.email);
      accounts.push({
        name: newName,
        email: newEmail,
        password: demoAccount.password,
        accountType: demoAccount.accountType,
        program: newProgram
      });
    }
    saveToStorage("eventEaseAccounts", accounts);

    if (newEmail !== user.email) {
      const registrations = getRegistrations();
      for (let i = 0; i < registrations.length; i++) {
        let owner = registrations[i].userEmail;
        if (owner === undefined) {
          owner = registrations[i].email;
        }
        if (owner === user.email) {
          registrations[i].userEmail = newEmail;
        }
      }
      saveRegistrations(registrations);
    }

    user.name = newName;
    user.email = newEmail;
    user.program = newProgram;
    saveToStorage("eventEaseUser", user);
    showMessage("editMessage", "Profile saved! You can go back to your profile now.", "success");
    showUserName();
  });
}

function setupSettingsPage() {
  const settings = getSettings();
  document.getElementById("emailRegistration").checked = settings.emailRegistration;
  document.getElementById("emailReminders").checked = settings.emailReminders;
  document.getElementById("emailUpdates").checked = settings.emailUpdates;
  document.getElementById("reminderTiming").value = settings.reminderTiming;
  document.getElementById("defaultCategory").value = settings.defaultCategory;
  document.getElementById("showName").checked = settings.showNameInAttendees;

  document.getElementById("settingsForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const newSettings = {
      emailRegistration: document.getElementById("emailRegistration").checked,
      emailReminders: document.getElementById("emailReminders").checked,
      emailUpdates: document.getElementById("emailUpdates").checked,
      reminderTiming: document.getElementById("reminderTiming").value,
      defaultCategory: document.getElementById("defaultCategory").value,
      showNameInAttendees: document.getElementById("showName").checked
    };
    saveToStorage("eventEaseSettings", newSettings);
    showMessage("settingsMessage", "Your settings have been saved.", "success");
  });

  document.getElementById("resetButton").addEventListener("click", function () {
    const sure = confirm("This will erase all saved demo data (registrations, favorites, created events, settings). Continue?");
    if (sure) {
      for (let i = 0; i < storageKeys.length; i++) {
        localStorage.removeItem(storageKeys[i]);
      }
      showMessage("settingsMessage", "Demo data was reset. The page will reload.", "success");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1200);
    }
  });
}

if (currentPage === "page-notifications") {
  setupNotificationsPage();
} else if (currentPage === "page-profile") {
  setupProfilePage();
} else if (currentPage === "page-edit-profile") {
  setupEditProfilePage();
} else if (currentPage === "page-settings") {
  setupSettingsPage();
}
