const storageKeys = [
  "eventEaseUser", "eventEaseAccounts", "eventEaseLoggedIn", "eventEaseRegistrations", "eventEaseFavorites",
  "eventEaseCustomEvents", "eventEaseDeletedEvents", "eventEaseReadNotifications", "eventEaseSettings"
];

function getFromStorage(key, defaultValue) {
  const savedText = localStorage.getItem(key);
  if (savedText === null) {
    return defaultValue;
  }
  return JSON.parse(savedText);
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


function getCurrentUser() {
  return getFromStorage("eventEaseUser", demoStudent);
}

function findDemoAccount(email) {
  if (email === demoStudent.email) {
    return demoStudent;
  }
  if (email === demoOrganizer.email) {
    return demoOrganizer;
  }
  return null;
}

function findAccountByEmail(email) {
  const accounts = getFromStorage("eventEaseAccounts", []);
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email === email) {
      return accounts[i];
    }
  }
  return findDemoAccount(email);
}

function removePassword(user) {
  return {
    name: user.name,
    email: user.email,
    accountType: user.accountType,
    program: user.program
  };
}

function getSettings() {
  const defaultSettings = {
    emailRegistration: true,
    emailReminders: true,
    emailUpdates: false,
    reminderTiming: "1 day before",
    defaultCategory: "All",
    showNameInAttendees: true
  };
  return getFromStorage("eventEaseSettings", defaultSettings);
}


function getRegistrations() {
  return getFromStorage("eventEaseRegistrations", defaultRegistrations);
}

function saveRegistrations(registrations) {
  saveToStorage("eventEaseRegistrations", registrations);
}

function getFavoriteIds() {
  return getFromStorage("eventEaseFavorites", []);
}

function getReadNotificationIds() {
  return getFromStorage("eventEaseReadNotifications", []);
}

function getCustomEvents() {
  return getFromStorage("eventEaseCustomEvents", []);
}

function getDeletedEventIds() {
  return getFromStorage("eventEaseDeletedEvents", []);
}

function isSampleEventId(eventId) {
  for (let i = 0; i < sampleEvents.length; i++) {
    if (sampleEvents[i].id === eventId) {
      return true;
    }
  }
  return false;
}

function getAllEvents() {
  const customEvents = getCustomEvents();
  const deletedIds = getDeletedEventIds();
  const allEvents = [];

  for (let i = 0; i < sampleEvents.length; i++) {
    let event = sampleEvents[i];
    for (let j = 0; j < customEvents.length; j++) {
      if (customEvents[j].id === event.id) {
        event = customEvents[j];
      }
    }
    if (deletedIds.includes(event.id) === false) {
      allEvents.push(event);
    }
  }

  for (let k = 0; k < customEvents.length; k++) {
    const isNew = isSampleEventId(customEvents[k].id) === false;
    if (isNew && deletedIds.includes(customEvents[k].id) === false) {
      allEvents.push(customEvents[k]);
    }
  }

  return sortEventsByDate(allEvents);
}

function sortEventsByDate(eventArray) {
  const sorted = eventArray.slice();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = 0; j < sorted.length - 1 - i; j++) {
      if (sorted[j].date > sorted[j + 1].date) {
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }
  return sorted;
}

function findEventById(eventId) {
  const allEvents = getAllEvents();
  for (let i = 0; i < allEvents.length; i++) {
    if (allEvents[i].id === eventId) {
      return allEvents[i];
    }
  }
  return null;
}

function getUpcomingEvents() {
  const allEvents = getAllEvents();
  const upcoming = [];
  for (let i = 0; i < allEvents.length; i++) {
    if (allEvents[i].date >= demoToday) {
      upcoming.push(allEvents[i]);
    }
  }
  return upcoming;
}

function getMyEvents() {
  const allEvents = getAllEvents();
  const myEvents = [];
  for (let i = 0; i < allEvents.length; i++) {
    if (allEvents[i].ownedByMe === true) {
      myEvents.push(allEvents[i]);
    }
  }
  return myEvents;
}

function getUserRegistrations() {
  const userEmail = getCurrentUser().email;
  const registrations = getRegistrations();
  const mine = [];
  for (let i = 0; i < registrations.length; i++) {
    let owner = registrations[i].userEmail;
    if (owner === undefined) {
      owner = registrations[i].email;
    }
    if (owner === userEmail) {
      mine.push(registrations[i]);
    }
  }
  return mine;
}

function getVisibleRegistrations() {
  const registrations = getUserRegistrations();
  const visible = [];
  for (let i = 0; i < registrations.length; i++) {
    if (findEventById(registrations[i].eventId) !== null) {
      visible.push(registrations[i]);
    }
  }
  return visible;
}

function countConfirmedRegistrations(eventId) {
  const registrations = getRegistrations();
  let count = 0;
  for (let i = 0; i < registrations.length; i++) {
    if (registrations[i].eventId === eventId && registrations[i].status === "Confirmed") {
      count = count + 1;
    }
  }
  return count;
}

function getRegisteredCount(event) {
  return event.registered + countConfirmedRegistrations(event.id);
}

function getSlotsLeft(event) {
  const slotsLeft = event.capacity - getRegisteredCount(event);
  if (slotsLeft < 0) {
    return 0;
  }
  return slotsLeft;
}

function findUserRegistration(eventId) {
  if (isLoggedIn() === false) {
    return null;
  }
  const registrations = getUserRegistrations();
  for (let i = 0; i < registrations.length; i++) {
    if (registrations[i].eventId === eventId && registrations[i].status === "Confirmed") {
      return registrations[i];
    }
  }
  return null;
}

function getEventStatus(event) {
  if (event.date < demoToday) {
    return "Completed";
  }
  if (findUserRegistration(event.id) !== null) {
    return "Registered";
  }
  if (getSlotsLeft(event) === 0) {
    return "Full";
  }
  return "Open";
}

function getQueryValue(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function padNumber(number) {
  if (number < 10) {
    return "0" + number;
  }
  return "" + number;
}

function formatDate(dateText) {
  const parts = dateText.split("-");
  const monthName = monthNames[Number(parts[1]) - 1].slice(0, 3);
  return monthName + " " + Number(parts[2]) + ", " + parts[0];
}

function formatTime(timeText) {
  const parts = timeText.split(":");
  const hour = Number(parts[0]);
  let suffix = "AM";
  if (hour >= 12) {
    suffix = "PM";
  }
  let displayHour = hour % 12;
  if (displayHour === 0) {
    displayHour = 12;
  }
  return displayHour + ":" + parts[1] + " " + suffix;
}

function makeSafe(text) {
  let safeText = String(text);
  safeText = safeText.split("&").join("&amp;");
  safeText = safeText.split("<").join("&lt;");
  safeText = safeText.split(">").join("&gt;");
  safeText = safeText.split('"').join("&quot;");
  return safeText;
}

function getCategorySymbol(category) {
  if (category === "Technology") { return "💻"; }
  if (category === "Workshop") { return "🛠"; }
  if (category === "Career") { return "💼"; }
  if (category === "Leadership") { return "🎤"; }
  if (category === "Sports") { return "🏀"; }
  if (category === "Arts & Music") { return "🎵"; }
  return "🎉";
}
