const publicFiles = ["index.html", "login.html", "register.html", ""];
const organizerFiles = ["organizer-dashboard.html", "create-event.html", "manage-events.html", "attendee-list.html", "reports.html"];
const sharedFiles = ["settings.html"];

function isLoggedIn() {
  return localStorage.getItem("eventEaseLoggedIn") === "yes";
}

function isOrganizerAccount() {
  const savedText = localStorage.getItem("eventEaseUser");
  if (savedText === null) {
    return false;
  }
  return JSON.parse(savedText).accountType === "organizer";
}

function getHomePageForUser() {
  if (isOrganizerAccount()) {
    return "organizer-dashboard.html";
  }
  return "dashboard.html";
}

function getRedirectTarget(fileName) {
  const loggedIn = isLoggedIn();

  if (publicFiles.includes(fileName)) {
    if (loggedIn) {
      return getHomePageForUser();
    }
    return null;
  }

  if (loggedIn === false) {
    return "login.html";
  }
  if (sharedFiles.includes(fileName)) {
    return null;
  }
  if (organizerFiles.includes(fileName) && isOrganizerAccount() === false) {
    return "dashboard.html";
  }
  if (organizerFiles.includes(fileName) === false && isOrganizerAccount()) {
    return "organizer-dashboard.html";
  }
  return null;
}

const redirectTarget = getRedirectTarget(window.location.pathname.split("/").pop());
if (redirectTarget !== null) {
  document.documentElement.style.display = "none";
  window.location.replace(redirectTarget);
}
