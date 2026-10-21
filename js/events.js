function setupEventsPage() {
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");

  const settings = getSettings();
  categorySelect.value = settings.defaultCategory;

  searchInput.addEventListener("input", showFilteredEvents);
  categorySelect.addEventListener("change", showFilteredEvents);
  showFilteredEvents();
}

function showFilteredEvents() {
  const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedCategory = document.getElementById("categorySelect").value;
  const upcoming = getUpcomingEvents();
  const matchingEvents = [];

  for (let i = 0; i < upcoming.length; i++) {
    const event = upcoming[i];
    const titleMatches = event.title.toLowerCase().includes(searchText);
    const categoryMatches = selectedCategory === "All" || event.category === selectedCategory;
    if (titleMatches && categoryMatches) {
      matchingEvents.push(event);
    }
  }

  showEventCards("eventGrid", matchingEvents, "No events match your search.");
  document.getElementById("resultCount").textContent = matchingEvents.length + " event(s) found";
}

function setupEventDetailsPage() {
  const eventId = Number(getQueryValue("id"));
  const event = findEventById(eventId);

  if (event === null) {
    document.getElementById("eventDetails").classList.add("hidden");
    document.getElementById("eventNotFound").classList.remove("hidden");
    return;
  }

  document.getElementById("eventSymbol").textContent = getCategorySymbol(event.category);
  const bannerImage = document.getElementById("eventImage");
  if (event.image === "") {
    bannerImage.classList.add("hidden");
  } else {
    bannerImage.src = event.image;
  }

  document.getElementById("eventTitle").textContent = event.title;
  document.getElementById("eventCategory").textContent = event.category;
  document.getElementById("eventDescription").textContent = event.description;
  document.getElementById("eventOrganizer").textContent = event.organizer;
  document.getElementById("eventDate").textContent = formatDate(event.date);
  document.getElementById("eventTime").textContent = formatTime(event.time);
  document.getElementById("eventVenue").textContent = event.venue;
  document.getElementById("eventSlots").textContent = getSlotsLeft(event) + " of " + event.capacity + " slots left";

  const status = getEventStatus(event);
  const statusText = document.getElementById("eventStatus");
  statusText.textContent = getStatusText(event);
  statusText.className = "status-" + status.toLowerCase();

  const registerButton = document.getElementById("registerButton");
  if (status === "Open") {
    registerButton.href = "event-registration.html?id=" + event.id;
  } else if (status === "Registered") {
    registerButton.textContent = "View My Registrations";
    registerButton.href = "my-registrations.html";
  } else {
    registerButton.textContent = "Registration Closed (" + status + ")";
    registerButton.className = "btn btn-outline hidden";
    document.getElementById("closedNote").textContent = "You cannot register for this event because it is " + status.toLowerCase() + ".";
  }

  const favoriteButton = document.getElementById("favoriteButton");
  updateFavoriteButton(event.id);
  favoriteButton.addEventListener("click", function () {
    toggleFavorite(event.id);
    updateFavoriteButton(event.id);
  });
}

function toggleFavorite(eventId) {
  const favoriteIds = getFavoriteIds();
  const position = favoriteIds.indexOf(eventId);
  if (position === -1) {
    favoriteIds.push(eventId);
  } else {
    favoriteIds.splice(position, 1);
  }
  saveToStorage("eventEaseFavorites", favoriteIds);
}

function updateFavoriteButton(eventId) {
  const favoriteButton = document.getElementById("favoriteButton");
  if (getFavoriteIds().includes(eventId)) {
    favoriteButton.textContent = "★ Remove from Favorites";
  } else {
    favoriteButton.textContent = "☆ Save to Favorites";
  }
}

function setupFavoritesPage() {
  showFavorites();
}

function showFavorites() {
  const favoriteIds = getFavoriteIds();
  const favoritesList = document.getElementById("favoritesList");
  let html = "";

  for (let i = 0; i < favoriteIds.length; i++) {
    const event = findEventById(favoriteIds[i]);
    if (event !== null) {
      html += '<div class="card list-item-card">';
      html += "<div>";
      html += "<h3>" + makeSafe(event.title) + "</h3>";
      html += '<p class="muted">📅 ' + formatDate(event.date) + " · 📍 " + makeSafe(event.venue) + "</p>";
      html += "</div>";
      html += '<div class="button-row">';
      html += '<a class="btn btn-primary btn-small" href="event-details.html?id=' + event.id + '">View Details</a>';
      html += '<button class="btn btn-danger btn-small remove-button" data-id="' + event.id + '">Remove</button>';
      html += "</div>";
      html += "</div>";
    }
  }

  if (html === "") {
    html = '<div class="card"><p>You have no favorite events yet.</p><a class="btn btn-primary btn-small" href="events.html">Browse Events</a></div>';
  }
  favoritesList.innerHTML = html;

  const removeButtons = document.querySelectorAll(".remove-button");
  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function () {
      const eventId = Number(removeButtons[i].getAttribute("data-id"));
      toggleFavorite(eventId);
      showFavorites();
    });
  }
}

let calendarYear = Number(demoToday.split("-")[0]);
let calendarMonth = Number(demoToday.split("-")[1]) - 1;

function setupCalendarPage() {
  document.getElementById("previousMonth").addEventListener("click", function () {
    calendarMonth = calendarMonth - 1;
    if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear = calendarYear - 1;
    }
    showCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", function () {
    calendarMonth = calendarMonth + 1;
    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear = calendarYear + 1;
    }
    showCalendar();
  });

  showCalendar();
}

function showCalendar() {
  document.getElementById("monthTitle").textContent = monthNames[calendarMonth] + " " + calendarYear;

  const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const allEvents = getAllEvents();

  let html = "";
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < dayNames.length; i++) {
    html += '<div class="calendar-day-name">' + dayNames[i] + "</div>";
  }

  for (let i = 0; i < firstWeekday; i++) {
    html += '<div class="calendar-cell empty"></div>';
  }

  let monthEventsHtml = "";
  for (let day = 1; day <= daysInMonth; day++) {
    const dateText = calendarYear + "-" + padNumber(calendarMonth + 1) + "-" + padNumber(day);
    html += '<div class="calendar-cell"><strong>' + day + "</strong>";
    for (let j = 0; j < allEvents.length; j++) {
      if (allEvents[j].date === dateText) {
        html += '<a class="calendar-event" href="event-details.html?id=' + allEvents[j].id + '">' + makeSafe(allEvents[j].title) + "</a>";
        monthEventsHtml += "<li><strong>" + formatDate(dateText) + "</strong> - ";
        monthEventsHtml += '<a href="event-details.html?id=' + allEvents[j].id + '">' + makeSafe(allEvents[j].title) + "</a>";
        monthEventsHtml += " at " + formatTime(allEvents[j].time) + "</li>";
      }
    }
    html += "</div>";
  }

  document.getElementById("calendarGrid").innerHTML = html;
  if (monthEventsHtml === "") {
    monthEventsHtml = '<li class="muted">No events this month.</li>';
  }
  document.getElementById("monthEventList").innerHTML = monthEventsHtml;
}

if (currentPage === "page-events") {
  setupEventsPage();
} else if (currentPage === "page-event-details") {
  setupEventDetailsPage();
} else if (currentPage === "page-favorites") {
  setupFavoritesPage();
} else if (currentPage === "page-calendar") {
  setupCalendarPage();
}
