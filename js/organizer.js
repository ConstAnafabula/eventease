function setupOrganizerDashboardPage() {
  const myEvents = getMyEvents();
  let totalRegistrations = 0;
  let upcomingCount = 0;
  let completedCount = 0;
  let upcomingHtml = "";

  for (let i = 0; i < myEvents.length; i++) {
    const event = myEvents[i];
    totalRegistrations = totalRegistrations + getRegisteredCount(event);
    if (event.date >= demoToday) {
      upcomingCount = upcomingCount + 1;
      upcomingHtml += "<tr>";
      upcomingHtml += "<td>" + makeSafe(event.title) + "</td>";
      upcomingHtml += "<td>" + formatDate(event.date) + "</td>";
      upcomingHtml += "<td>" + getRegisteredCount(event) + " / " + event.capacity + "</td>";
      upcomingHtml += '<td><a href="attendee-list.html?id=' + event.id + '">Attendees</a></td>';
      upcomingHtml += "</tr>";
    } else {
      completedCount = completedCount + 1;
    }
  }

  document.getElementById("totalEvents").textContent = myEvents.length;
  document.getElementById("totalRegistrations").textContent = totalRegistrations;
  document.getElementById("upcomingEvents").textContent = upcomingCount;
  document.getElementById("completedEvents").textContent = completedCount;

  if (upcomingHtml === "") {
    upcomingHtml = '<tr><td colspan="4" class="muted">No upcoming events. Create one!</td></tr>';
  }
  document.getElementById("upcomingTable").innerHTML = upcomingHtml;
}

let editingEvent = null;

function setupCreateEventPage() {
  const eventId = Number(getQueryValue("id"));
  if (eventId !== 0) {
    editingEvent = findEventById(eventId);
  }

  if (editingEvent !== null) {
    document.getElementById("pageTitle").textContent = "Edit Event";
    document.getElementById("submitButton").textContent = "Save Changes";
    document.getElementById("eventTitleInput").value = editingEvent.title;
    document.getElementById("eventDescriptionInput").value = editingEvent.description;
    document.getElementById("eventCategoryInput").value = editingEvent.category;
    document.getElementById("eventDateInput").value = editingEvent.date;
    document.getElementById("eventTimeInput").value = editingEvent.time;
    document.getElementById("eventVenueInput").value = editingEvent.venue;
    document.getElementById("eventCapacityInput").value = editingEvent.capacity;
    document.getElementById("eventImageInput").value = editingEvent.image;
  }

  document.getElementById("createEventForm").addEventListener("submit", function (event) {
    event.preventDefault();
    saveEventFromForm();
  });
}

function saveEventFromForm() {
  const title = document.getElementById("eventTitleInput").value.trim();
  const description = document.getElementById("eventDescriptionInput").value.trim();
  const category = document.getElementById("eventCategoryInput").value;
  const date = document.getElementById("eventDateInput").value;
  const time = document.getElementById("eventTimeInput").value;
  const venue = document.getElementById("eventVenueInput").value.trim();
  const capacity = Number(document.getElementById("eventCapacityInput").value);
  const image = document.getElementById("eventImageInput").value.trim();

  if (title === "" || description === "" || category === "" || date === "" || time === "" || venue === "") {
    showMessage("createMessage", "Please fill in every required field.", "error");
    return;
  }
  if (capacity < 1) {
    showMessage("createMessage", "Capacity must be at least 1.", "error");
    return;
  }
  if (editingEvent !== null && capacity < getRegisteredCount(editingEvent)) {
    showMessage("createMessage", "Capacity cannot be lower than the current number of registrations (" + getRegisteredCount(editingEvent) + ").", "error");
    return;
  }

  const customEvents = getCustomEvents();
  let savedEvent = null;

  if (editingEvent !== null) {
    savedEvent = {
      id: editingEvent.id, title: title, category: category, date: date, time: time, venue: venue,
      organizer: editingEvent.organizer, capacity: capacity, registered: editingEvent.registered,
      attended: editingEvent.attended, description: description, image: image,
      featured: editingEvent.featured, ownedByMe: true
    };
    let replaced = false;
    for (let i = 0; i < customEvents.length; i++) {
      if (customEvents[i].id === savedEvent.id) {
        customEvents[i] = savedEvent;
        replaced = true;
      }
    }
    if (replaced === false) {
      customEvents.push(savedEvent);
    }
  } else {
    let newId = 100;
    const allEvents = getAllEvents();
    for (let i = 0; i < allEvents.length; i++) {
      if (allEvents[i].id >= newId) {
        newId = allEvents[i].id + 1;
      }
    }
    const deletedIds = getDeletedEventIds();
    for (let i = 0; i < deletedIds.length; i++) {
      if (deletedIds[i] >= newId) {
        newId = deletedIds[i] + 1;
      }
    }
    savedEvent = {
      id: newId, title: title, category: category, date: date, time: time, venue: venue,
      organizer: "BSIT Student Society", capacity: capacity, registered: 0, attended: 0,
      description: description, image: image, featured: false, ownedByMe: true
    };
    customEvents.push(savedEvent);
  }

  saveToStorage("eventEaseCustomEvents", customEvents);

  document.getElementById("createEventForm").classList.add("hidden");
  hideMessage("createMessage");
  document.getElementById("successBox").classList.remove("hidden");
  document.getElementById("successText").textContent = '"' + title + '" was saved successfully.';
  document.getElementById("successViewLink").href = "attendee-list.html?id=" + savedEvent.id;
}

function setupManageEventsPage() {
  showManageEvents();
}

function showManageEvents() {
  const myEvents = getMyEvents();
  let html = "";

  for (let i = 0; i < myEvents.length; i++) {
    const event = myEvents[i];
    const status = getEventStatus(event);
    let statusLabel = status;
    if (status === "Registered") {
      statusLabel = "Open";
    }
    html += "<tr>";
    html += "<td>" + makeSafe(event.title) + "</td>";
    html += "<td>" + formatDate(event.date) + "</td>";
    html += '<td class="status-' + statusLabel.toLowerCase() + '">' + statusLabel + "</td>";
    html += "<td>" + getRegisteredCount(event) + " / " + event.capacity + "</td>";
    html += "<td>";
    html += '<a href="create-event.html?id=' + event.id + '">Edit</a> · ';
    html += '<a href="attendee-list.html?id=' + event.id + '">Attendees</a> · ';
    html += '<button class="btn btn-danger btn-small delete-button" data-id="' + event.id + '">Delete</button>';
    html += "</td>";
    html += "</tr>";
  }

  if (html === "") {
    html = '<tr><td colspan="5" class="muted">You have no events yet.</td></tr>';
  }
  document.getElementById("manageTable").innerHTML = html;

  const deleteButtons = document.querySelectorAll(".delete-button");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function () {
      const eventId = Number(deleteButtons[i].getAttribute("data-id"));
      deleteEvent(eventId);
    });
  }
}

function deleteEvent(eventId) {
  const event = findEventById(eventId);
  const sure = confirm('Delete "' + event.title + '"? This cannot be undone.');
  if (sure === false) {
    return;
  }
  const deletedIds = getDeletedEventIds();
  deletedIds.push(eventId);
  saveToStorage("eventEaseDeletedEvents", deletedIds);
  showMessage("manageMessage", '"' + event.title + '" was deleted.', "success");
  showManageEvents();
}

function setupAttendeeListPage() {
  const myEvents = getMyEvents();
  const eventSelect = document.getElementById("eventSelect");

  let optionsHtml = "";
  for (let i = 0; i < myEvents.length; i++) {
    optionsHtml += '<option value="' + myEvents[i].id + '">' + makeSafe(myEvents[i].title) + "</option>";
  }
  eventSelect.innerHTML = optionsHtml;

  const eventId = getQueryValue("id");
  if (eventId !== null) {
    eventSelect.value = eventId;
  }

  eventSelect.addEventListener("change", showAttendees);
  document.getElementById("attendeeSearch").addEventListener("input", showAttendees);
  showAttendees();
}

function showAttendees() {
  const eventId = Number(document.getElementById("eventSelect").value);
  const searchText = document.getElementById("attendeeSearch").value.trim().toLowerCase();
  const event = findEventById(eventId);
  const attendeeTable = document.getElementById("attendeeTable");

  if (event === null) {
    attendeeTable.innerHTML = '<tr><td colspan="3" class="muted">No events to show.</td></tr>';
    return;
  }

  const attendees = [];
  const registrations = getRegistrations();
  for (let i = 0; i < registrations.length; i++) {
    if (registrations[i].eventId === eventId && registrations[i].status === "Confirmed") {
      attendees.push({ name: registrations[i].name, email: registrations[i].email, status: "Confirmed" });
    }
  }
  for (let i = 0; i < sampleAttendees.length && i < event.registered; i++) {
    let status = "Confirmed";
    if (event.date < demoToday) {
      status = "Attended";
      if (i % 5 === 4) {
        status = "Absent";
      }
    } else if (i % 5 === 4) {
      status = "Pending";
    }
    attendees.push({ name: sampleAttendees[i].name, email: sampleAttendees[i].email, status: status });
  }

  let html = "";
  let shown = 0;
  for (let i = 0; i < attendees.length; i++) {
    const nameMatches = attendees[i].name.toLowerCase().includes(searchText);
    const emailMatches = attendees[i].email.toLowerCase().includes(searchText);
    if (nameMatches || emailMatches) {
      html += "<tr>";
      html += "<td>" + makeSafe(attendees[i].name) + "</td>";
      html += "<td>" + makeSafe(attendees[i].email) + "</td>";
      html += '<td class="status-' + attendees[i].status.toLowerCase() + '">' + attendees[i].status + "</td>";
      html += "</tr>";
      shown = shown + 1;
    }
  }
  if (html === "") {
    html = '<tr><td colspan="3" class="muted">No attendees match your search.</td></tr>';
  }
  attendeeTable.innerHTML = html;

  document.getElementById("attendeeSummary").textContent =
    getRegisteredCount(event) + " registered in total. Showing " + shown + " sample attendee(s).";
}

function setupReportsPage() {
  const myEvents = getMyEvents();
  let totalRegistrations = 0;
  let totalCapacity = 0;
  let totalAttended = 0;
  let totalCompletedRegistrations = 0;
  let fillHtml = "";
  let attendanceHtml = "";

  for (let i = 0; i < myEvents.length; i++) {
    const event = myEvents[i];
    const registered = getRegisteredCount(event);
    totalRegistrations = totalRegistrations + registered;
    totalCapacity = totalCapacity + event.capacity;

    const fillPercent = Math.round((registered / event.capacity) * 100);
    fillHtml += '<div class="bar-row">';
    fillHtml += "<p>" + makeSafe(event.title) + ' <span class="muted">(' + registered + " / " + event.capacity + " - " + fillPercent + "%)</span></p>";
    fillHtml += '<div class="bar-track"><div class="bar-fill" style="width: ' + fillPercent + '%"></div></div>';
    fillHtml += "</div>";

    if (event.date < demoToday) {
      totalAttended = totalAttended + event.attended;
      totalCompletedRegistrations = totalCompletedRegistrations + registered;
      let attendPercent = 0;
      if (registered > 0) {
        attendPercent = Math.round((event.attended / registered) * 100);
      }
      attendanceHtml += '<div class="bar-row">';
      attendanceHtml += "<p>" + makeSafe(event.title) + ' <span class="muted">(' + event.attended + " of " + registered + " attended - " + attendPercent + "%)</span></p>";
      attendanceHtml += '<div class="bar-track"><div class="bar-fill" style="width: ' + attendPercent + '%"></div></div>';
      attendanceHtml += "</div>";
    }
  }

  let averageFill = 0;
  if (totalCapacity > 0) {
    averageFill = Math.round((totalRegistrations / totalCapacity) * 100);
  }
  let attendanceRate = 0;
  if (totalCompletedRegistrations > 0) {
    attendanceRate = Math.round((totalAttended / totalCompletedRegistrations) * 100);
  }

  document.getElementById("reportEvents").textContent = myEvents.length;
  document.getElementById("reportRegistrations").textContent = totalRegistrations;
  document.getElementById("reportFill").textContent = averageFill + "%";
  document.getElementById("reportAttendance").textContent = attendanceRate + "%";
  document.getElementById("fillBars").innerHTML = fillHtml;
  if (attendanceHtml === "") {
    attendanceHtml = '<p class="muted">No completed events yet.</p>';
  }
  document.getElementById("attendanceBars").innerHTML = attendanceHtml;
}

if (currentPage === "page-organizer-dashboard") {
  setupOrganizerDashboardPage();
} else if (currentPage === "page-create-event") {
  setupCreateEventPage();
} else if (currentPage === "page-manage-events") {
  setupManageEventsPage();
} else if (currentPage === "page-attendee-list") {
  setupAttendeeListPage();
} else if (currentPage === "page-reports") {
  setupReportsPage();
}
