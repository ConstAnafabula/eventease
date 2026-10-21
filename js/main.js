const currentPage = document.body.id;

function showUserName() {
  const user = getCurrentUser();
  const nameElements = document.querySelectorAll(".user-name");
  for (let i = 0; i < nameElements.length; i++) {
    nameElements[i].textContent = user.name;
  }
}

function useOrganizerMenuOnSettings() {
  const navLinks = document.getElementById("navLinks");
  if (currentPage !== "page-settings" || getCurrentUser().accountType !== "organizer") {
    return;
  }
  document.querySelector(".logo").href = "organizer-dashboard.html";
  navLinks.innerHTML =
    '<a href="organizer-dashboard.html">Dashboard</a>' +
    '<a href="create-event.html">Create Event</a>' +
    '<a href="manage-events.html">Manage Events</a>' +
    '<a href="attendee-list.html">Attendees</a>' +
    '<a href="reports.html">Reports</a>' +
    '<a href="settings.html" class="active">Settings</a>' +
    '<a href="index.html" id="logoutLink">Logout</a>';
}

function setupMenuButton() {
  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");
  if (menuButton === null) {
    return;
  }
  menuButton.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}

function setupLogoutLink() {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink === null) {
    return;
  }
  logoutLink.addEventListener("click", function () {
    localStorage.removeItem("eventEaseLoggedIn");
  });
}

function showMessage(elementId, text, type) {
  const messageBox = document.getElementById(elementId);
  messageBox.textContent = text;
  messageBox.className = "message " + type;
}

function hideMessage(elementId) {
  const messageBox = document.getElementById(elementId);
  messageBox.textContent = "";
  messageBox.className = "message hidden";
}

function getStatusText(event) {
  const status = getEventStatus(event);
  if (status === "Registered") {
    return "✔ Registered";
  }
  if (status === "Open") {
    const slotsLeft = getSlotsLeft(event);
    if (slotsLeft === 1) {
      return "1 slot left";
    }
    return slotsLeft + " slots left";
  }
  if (status === "Full") {
    return "Full - no slots left";
  }
  return status;
}

function buildEventCard(event) {
  const status = getEventStatus(event);
  let html = "";
  html += '<article class="card event-card">';
  html += '<div class="event-banner">' + getCategorySymbol(event.category);
  if (event.image !== "") {
    html += '<img src="' + event.image + '" alt="">';
  }
  html += "</div>";
  html += '<div class="card-body">';
  html += '<span class="badge">' + makeSafe(event.category) + "</span>";
  html += "<h3>" + makeSafe(event.title) + "</h3>";
  html += '<p class="muted">📅 ' + formatDate(event.date) + " at " + formatTime(event.time) + "</p>";
  html += '<p class="muted">📍 ' + makeSafe(event.venue) + "</p>";
  html += '<p class="status-' + status.toLowerCase() + '">' + getStatusText(event) + "</p>";
  if (isLoggedIn()) {
    html += '<a class="btn btn-primary btn-small" href="event-details.html?id=' + event.id + '">View Details</a>';
  } else {
    html += '<a class="btn btn-primary btn-small" href="login.html">Login to View Details</a>';
  }
  html += "</div>";
  html += "</article>";
  return html;
}

function showEventCards(containerId, eventArray, emptyMessage) {
  const container = document.getElementById(containerId);
  if (eventArray.length === 0) {
    container.innerHTML = '<p class="muted">' + emptyMessage + "</p>";
    return;
  }
  let html = "";
  for (let i = 0; i < eventArray.length; i++) {
    html += buildEventCard(eventArray[i]);
  }
  container.innerHTML = html;
}

showUserName();
useOrganizerMenuOnSettings();
setupMenuButton();
setupLogoutLink();