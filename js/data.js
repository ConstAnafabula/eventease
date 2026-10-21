const demoToday = "2026-10-20";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const demoStudent = {
  name: "Kaizer Entrata",
  email: "kaizer.entrata@chmsu.edu.ph",
  password: "kaizer2026",
  accountType: "student",
  program: "BS Information Technology"
};

const demoOrganizer = {
  name: "Marky Gonzalez",
  email: "marky.gonzales@chmsu.edu.ph",
  password: "marky2026",
  accountType: "organizer",
  program: "BSIT Student Society"
};

const sampleEvents = [
  {
    id: 14, title: "Intro to Python Bootcamp", category: "Workshop",
    date: "2026-10-03", time: "09:00", venue: "Computer Lab 3",
    organizer: "BSIT Student Society", capacity: 40, registered: 38, attended: 33,
    description: "A hands-on beginner bootcamp covering variables, loops, and functions in Python.",
    image: "https://picsum.photos/seed/python/800/450", featured: false, ownedByMe: true
  },
  {
    id: 15, title: "Tech Orientation Day", category: "Technology",
    date: "2026-09-19", time: "10:00", venue: "University Auditorium",
    organizer: "BSIT Student Society", capacity: 150, registered: 132, attended: 118,
    description: "An orientation for new IT students about clubs, labs, and campus resources.",
    image: "https://picsum.photos/seed/orientation/800/450", featured: false, ownedByMe: true
  },
  {
    id: 13, title: "Freshmen Welcome Mixer", category: "Leadership",
    date: "2026-09-12", time: "17:00", venue: "Student Center Ballroom",
    organizer: "Student Affairs Office", capacity: 200, registered: 180, attended: 165,
    description: "A relaxed evening for first-year students to meet classmates and student leaders.",
    image: "https://picsum.photos/seed/welcome/800/450", featured: false, ownedByMe: false
  },
  {
    id: 12, title: "Cybersecurity Awareness Talk", category: "Technology",
    date: "2026-10-24", time: "15:00", venue: "Lecture Hall B",
    organizer: "BSIT Student Society", capacity: 120, registered: 74, attended: 0,
    description: "Learn how to protect your passwords, accounts, and devices from common online threats.",
    image: "https://picsum.photos/seed/security/800/450", featured: false, ownedByMe: true
  },
  {
    id: 4, title: "Web Development Workshop", category: "Workshop",
    date: "2026-10-29", time: "13:00", venue: "Computer Lab 3",
    organizer: "BSIT Student Society", capacity: 40, registered: 35, attended: 0,
    description: "Build your first website with HTML, CSS, and JavaScript in one afternoon.",
    image: "https://picsum.photos/seed/webdev/800/450", featured: false, ownedByMe: true
  },
  {
    id: 9, title: "Resume Writing Clinic", category: "Workshop",
    date: "2026-11-03", time: "14:00", venue: "Library Room 2",
    organizer: "Career Services Office", capacity: 35, registered: 20, attended: 0,
    description: "Get tips and one-on-one feedback to make your resume stand out to employers.",
    image: "https://picsum.photos/seed/resume/800/450", featured: false, ownedByMe: false
  },
  {
    id: 3, title: "Student Leadership Conference", category: "Leadership",
    date: "2026-11-07", time: "08:30", venue: "Student Center Ballroom",
    organizer: "Student Affairs Office", capacity: 150, registered: 120, attended: 0,
    description: "A full-day conference with speakers and activities on teamwork and leading student groups.",
    image: "https://picsum.photos/seed/leadership/800/450", featured: false, ownedByMe: false
  },
  {
    id: 10, title: "Campus Photography Walk", category: "Arts & Music",
    date: "2026-11-10", time: "16:00", venue: "Campus Gardens",
    organizer: "Photography Club", capacity: 30, registered: 18, attended: 0,
    description: "Walk around campus with fellow photographers and learn simple composition tricks.",
    image: "https://picsum.photos/seed/photo/800/450", featured: false, ownedByMe: false
  },
  {
    id: 1, title: "BSIT Tech Summit", category: "Technology",
    date: "2026-11-14", time: "09:00", venue: "University Auditorium",
    organizer: "BSIT Student Society", capacity: 300, registered: 214, attended: 0,
    description: "The biggest IT event of the semester, with talks on software, networking, and careers in technology.",
    image: "https://picsum.photos/seed/techsummit/800/450", featured: true, ownedByMe: true
  },
  {
    id: 8, title: "Career and Internship Fair", category: "Career",
    date: "2026-11-19", time: "09:00", venue: "University Gymnasium",
    organizer: "Career Services Office", capacity: 600, registered: 410, attended: 0,
    description: "Meet company representatives, learn about internships, and submit your resume.",
    image: "https://picsum.photos/seed/career/800/450", featured: true, ownedByMe: false
  },
  {
    id: 2, title: "Campus Innovation Expo", category: "Technology",
    date: "2026-11-21", time: "10:00", venue: "Engineering Hall",
    organizer: "College of Engineering", capacity: 250, registered: 180, attended: 0,
    description: "Students show off their projects, prototypes, and creative ideas to the whole campus.",
    image: "https://picsum.photos/seed/expo/800/450", featured: true, ownedByMe: false
  },
  {
    id: 6, title: "Campus Music Night", category: "Arts & Music",
    date: "2026-11-27", time: "18:00", venue: "Open Quad",
    organizer: "Arts and Culture Club", capacity: 400, registered: 265, attended: 0,
    description: "An evening of live performances by student bands, singers, and dancers.",
    image: "https://picsum.photos/seed/music/800/450", featured: false, ownedByMe: false
  },
  {
    id: 11, title: "Intro to UI/UX Design Workshop", category: "Workshop",
    date: "2026-12-03", time: "13:30", venue: "Computer Lab 2",
    organizer: "BSIT Student Society", capacity: 45, registered: 28, attended: 0,
    description: "Learn the basics of user interface design and sketch your own app screen.",
    image: "https://picsum.photos/seed/design/800/450", featured: false, ownedByMe: true
  },
  {
    id: 5, title: "Interdepartmental Sports Festival", category: "Sports",
    date: "2026-12-05", time: "07:00", venue: "University Gymnasium",
    organizer: "Sports Council", capacity: 500, registered: 320, attended: 0,
    description: "Departments compete in basketball, volleyball, and relay races for the campus trophy.",
    image: "https://picsum.photos/seed/sports/800/450", featured: false, ownedByMe: false
  },
  {
    id: 7, title: "Programming Competition", category: "Technology",
    date: "2026-12-12", time: "09:00", venue: "Computer Lab 1",
    organizer: "BSIT Student Society", capacity: 60, registered: 60, attended: 0,
    description: "Solve coding challenges against the clock and win prizes. Registration is full.",
    image: "https://picsum.photos/seed/coding/800/450", featured: false, ownedByMe: true
  }
];

const sampleAttendees = [
  { name: "Maria Santos", email: "maria.santos@campus.edu" },
  { name: "John Reyes", email: "john.reyes@campus.edu" },
  { name: "Angela Cruz", email: "angela.cruz@campus.edu" },
  { name: "Mark Villanueva", email: "mark.villanueva@campus.edu" },
  { name: "Sofia Mendoza", email: "sofia.mendoza@campus.edu" },
  { name: "Daniel Garcia", email: "daniel.garcia@campus.edu" },
  { name: "Patricia Lim", email: "patricia.lim@campus.edu" },
  { name: "Carlo Navarro", email: "carlo.navarro@campus.edu" },
  { name: "Bianca Torres", email: "bianca.torres@campus.edu" },
  { name: "Miguel Ramos", email: "miguel.ramos@campus.edu" },
  { name: "Hannah Castillo", email: "hannah.castillo@campus.edu" },
  { name: "Joshua Bautista", email: "joshua.bautista@campus.edu" }
];

const defaultRegistrations = [
  {
    id: "REG-1001", eventId: 12, userEmail: "kaizer.entrata@chmsu.edu.ph",
    name: "Kaizer Entrata", email: "kaizer.entrata@chmsu.edu.ph",
    studentId: "2024-00123", yearLevel: "2nd Year", reason: "I want to learn how to stay safe online.",
    status: "Confirmed", registeredOn: "10/16/2026"
  },
  {
    id: "REG-1002", eventId: 4, userEmail: "kaizer.entrata@chmsu.edu.ph",
    name: "Kaizer Entrata", email: "kaizer.entrata@chmsu.edu.ph",
    studentId: "2024-00123", yearLevel: "2nd Year", reason: "I am learning web development.",
    status: "Confirmed", registeredOn: "10/17/2026"
  }
];

const sampleNotifications = [
  { id: 1, type: "Update", message: "Programming Competition is now full. No more slots are available.", time: "Today" },
  { id: 2, type: "Reminder", message: "Cybersecurity Awareness Talk is on Oct 24 at 3:00 PM in Lecture Hall B.", time: "Today" },
  { id: 3, type: "Update", message: "Campus Music Night will start at 6:00 PM at the Open Quad.", time: "Yesterday" },
  { id: 4, type: "Registration", message: "Your registration for Web Development Workshop is confirmed.", time: "3 days ago" },
  { id: 5, type: "Registration", message: "Your registration for Cybersecurity Awareness Talk is confirmed.", time: "4 days ago" },
  { id: 6, type: "Update", message: "Registration for the Career and Internship Fair is now open.", time: "1 week ago" }
];
