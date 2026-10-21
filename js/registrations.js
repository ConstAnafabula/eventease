function setupRegistrationPage() {
  const eventId = Number(getQueryValue("id"));
  const event = findEventById(eventId);

  if (event === null) {
    document.getElementById("registrationContent").classList.add("hidden");
    document.getElementById("eventNotFound").classList.remove("hidden");
    return;
  }

  document.getElementById("eventTitle").textContent = event.title;
  document.getElementById("eventInfo").textContent =
    formatDate(event.date) + " at " + formatTime(event.time) + " · " + event.venue;
  document.getElementById("eventSlots").textContent = getSlotsLeft(event) + " slots left";

  const user = getCurrentUser();
  document.getElementById("attendeeName").value = user.name;
  document.getElementById("attendeeEmail").value = user.email;

  const status = getEventStatus(event);
  if (status !== "Open") {
    showMessage("registrationMessage", "Registration is not available for this event (" + status + ").", "error");
    document.getElementById("registrationForm").classList.add("hidden");
    return;
  }

  document.getElementById("registrationForm").addEventListener("submit", function (submitEvent) {
    submitEvent.preventDefault();
    submitRegistration(event);
  });
}

function submitRegistration(event) {
  const name = document.getElementById("attendeeName").value.trim();
  const email = document.getElementById("attendeeEmail").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const yearLevel = document.getElementById("yearLevel").value;
  const reason = document.getElementById("reason").value.trim();
  const agreeBox = document.getElementById("agreeBox");

  if (name === "" || email === "" || studentId === "" || yearLevel === "") {
    showMessage("registrationMessage", "Please fill in your name, email, student ID, and year level.", "error");
    return;
  }
  if (email.includes("@") === false || email.includes(".") === false) {
    showMessage("registrationMessage", "Please enter a valid email address.", "error");
    return;
  }
  if (agreeBox.checked === false) {
    showMessage("registrationMessage", "Please confirm that your information is correct.", "error");
    return;
  }

  if (getSlotsLeft(event) === 0) {
    showMessage("registrationMessage", "Sorry, this event just became full.", "error");
    return;
  }

  const registrations = getRegistrations();
  const newRegistration = {
    id: "REG-" + (1001 + registrations.length),
    eventId: event.id,
    userEmail: getCurrentUser().email,
    name: name,
    email: email,
    studentId: studentId,
    yearLevel: yearLevel,
    reason: reason,
    status: "Confirmed",
    registeredOn: new Date().toLocaleDateString()
  };
  registrations.push(newRegistration);
  saveRegistrations(registrations);

  hideMessage("registrationMessage");
  document.getElementById("registrationForm").classList.add("hidden");
  document.getElementById("confirmationBox").classList.remove("hidden");
  document.getElementById("confirmationId").textContent = newRegistration.id;
  document.getElementById("confirmationEvent").textContent = event.title;
  document.getElementById("confirmationLink").href = "registration-details.html?id=" + newRegistration.id;
}

function setupMyRegistrationsPage() {
  showMyRegistrations();
}

function showMyRegistrations() {
  const registrations = getVisibleRegistrations();
  const registrationList = document.getElementById("registrationList");
  let html = "";

  for (let i = registrations.length - 1; i >= 0; i--) {
    const registration = registrations[i];
    const event = findEventById(registration.eventId);
    html += '<div class="card list-item-card">';
    html += "<div>";
    html += "<h3>" + makeSafe(event.title) + "</h3>";
    html += '<p class="muted">📅 ' + formatDate(event.date) + " · 📍 " + makeSafe(event.venue) + "</p>";
    html += '<p class="muted">' + registration.id + ' · Status: <span class="status-' + registration.status.toLowerCase() + '">' + registration.status + "</span></p>";
    html += "</div>";
    html += '<div class="button-row">';
    html += '<a class="btn btn-primary btn-small" href="registration-details.html?id=' + registration.id + '">View Details</a>';
    if (registration.status === "Confirmed" && event.date >= demoToday) {
      html += '<button class="btn btn-danger btn-small cancel-button" data-id="' + registration.id + '">Cancel</button>';
    }
    html += "</div>";
    html += "</div>";
  }

  if (html === "") {
    html = '<div class="card"><p>You have not registered for any events yet.</p><a class="btn btn-primary btn-small" href="events.html">Browse Events</a></div>';
  }
  registrationList.innerHTML = html;

  const cancelButtons = document.querySelectorAll(".cancel-button");
  for (let i = 0; i < cancelButtons.length; i++) {
    cancelButtons[i].addEventListener("click", function () {
      const registrationId = cancelButtons[i].getAttribute("data-id");
      if (cancelRegistration(registrationId)) {
        showMyRegistrations();
      }
    });
  }
}

function cancelRegistration(registrationId) {
  const sure = confirm("Are you sure you want to cancel this registration?");
  if (sure === false) {
    return false;
  }
  const registrations = getRegistrations();
  for (let i = 0; i < registrations.length; i++) {
    if (registrations[i].id === registrationId) {
      registrations[i].status = "Cancelled";
    }
  }
  saveRegistrations(registrations);
  return true;
}

function setupRegistrationDetailsPage() {
  showRegistrationDetails();
}

function showRegistrationDetails() {
  const registrationId = getQueryValue("id");
  const registrations = getUserRegistrations();
  let registration = null;
  for (let i = 0; i < registrations.length; i++) {
    if (registrations[i].id === registrationId) {
      registration = registrations[i];
    }
  }

  let event = null;
  if (registration !== null) {
    event = findEventById(registration.eventId);
  }
  if (registration === null || event === null) {
    document.getElementById("registrationDetails").classList.add("hidden");
    document.getElementById("registrationNotFound").classList.remove("hidden");
    return;
  }

  document.getElementById("detailId").textContent = registration.id;
  document.getElementById("detailStatus").textContent = registration.status;
  document.getElementById("detailStatus").className = "status-" + registration.status.toLowerCase();
  document.getElementById("detailRegisteredOn").textContent = registration.registeredOn;
  document.getElementById("detailName").textContent = registration.name;
  document.getElementById("detailEmail").textContent = registration.email;
  document.getElementById("detailStudentId").textContent = registration.studentId;
  document.getElementById("detailYear").textContent = registration.yearLevel;
  document.getElementById("detailEventTitle").textContent = event.title;
  document.getElementById("detailEventDate").textContent = formatDate(event.date) + " at " + formatTime(event.time);
  document.getElementById("detailEventVenue").textContent = event.venue;
  document.getElementById("detailEventLink").href = "event-details.html?id=" + event.id;

  const cancelButton = document.getElementById("cancelButton");
  if (registration.status === "Confirmed" && event.date >= demoToday) {
    cancelButton.classList.remove("hidden");
    cancelButton.addEventListener("click", function () {
      if (cancelRegistration(registration.id)) {
        showRegistrationDetails();
        showMessage("detailMessage", "Your registration has been cancelled.", "success");
      }
    });
  } else {
    cancelButton.classList.add("hidden");
  }
}

if (currentPage === "page-event-registration") {
  setupRegistrationPage();
} else if (currentPage === "page-my-registrations") {
  setupMyRegistrationsPage();
} else if (currentPage === "page-registration-details") {
  setupRegistrationDetailsPage();
}
