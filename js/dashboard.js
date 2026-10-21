function getFeaturedEvents() {
  const upcoming = getUpcomingEvents();
  const featured = [];
  for (let i = 0; i < upcoming.length; i++) {
    if (upcoming[i].featured === true && featured.length < 3) {
      featured.push(upcoming[i]);
    }
  }
  return featured;
}

function setupHomePage() {
  showEventCards("featuredEvents", getFeaturedEvents(), "No featured events right now.");
}

function setupDashboardPage() {
  const user = getCurrentUser();
  const firstName = user.name.split(" ")[0];
  document.getElementById("welcomeName").textContent = firstName;

  const visibleRegistrations = getVisibleRegistrations();
  let confirmedCount = 0;
  for (let i = 0; i < visibleRegistrations.length; i++) {
    if (visibleRegistrations[i].status === "Confirmed") {
      confirmedCount = confirmedCount + 1;
    }
  }
  document.getElementById("upcomingCount").textContent = getUpcomingEvents().length;
  document.getElementById("registrationCount").textContent = confirmedCount;
  document.getElementById("favoriteCount").textContent = getFavoriteIds().length;

  showEventCards("featuredEvents", getFeaturedEvents(), "No featured events right now.");
  showRecentActivity(visibleRegistrations);
}

function showRecentActivity(registrations) {
  const activityList = document.getElementById("activityList");
  let html = "";
  let shown = 0;

  for (let i = registrations.length - 1; i >= 0 && shown < 3; i--) {
    const registration = registrations[i];
    const event = findEventById(registration.eventId);
    if (registration.status === "Confirmed") {
      html += "<li>✔ Registered for <strong>" + makeSafe(event.title) + "</strong> on " + registration.registeredOn + "</li>";
    } else {
      html += "<li>✖ Cancelled registration for <strong>" + makeSafe(event.title) + "</strong></li>";
    }
    shown = shown + 1;
  }

  if (html === "") {
    html = '<li class="muted">No activity yet. Browse events to get started!</li>';
  }
  activityList.innerHTML = html;
}

if (currentPage === "page-home") {
  setupHomePage();
} else if (currentPage === "page-dashboard") {
  setupDashboardPage();
}
