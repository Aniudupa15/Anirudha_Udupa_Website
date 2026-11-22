export const contact = {
  name: "Anirudha Udupa",
  email: "aniudupa15@gmail.com",
  phone: "+91 99721 02246",
  linkedin: "https://www.linkedin.com/in/anirudha-udupa-815b0b258/",
  github: "https://github.com/Aniudupa15",
  location: "Mangaluru, India",
  resume: "/Anirudha-Udupa-Resume.pdf",
};

export const statement =
  "I love taking an idea all the way: the Flutter app, the backend, payments and notifications, right up to launch day. My favourite moment is seeing real people use something I made.";

export const stats = [
  { value: 8, suffix: "", label: "Apps shipped end to end" },
  { value: 70, suffix: "%", label: "Faster app at Rablo Inovate" },
  { value: 3, suffix: "", label: "Developers led as an intern" },
  { value: 8.59, suffix: "", label: "CGPA, Canara Engineering College", decimals: 2 },
];

export type Work = {
  n: string;
  title: string;
  kind: string;
  year: string;
  body: string;
  points: string[];
  stack: string[];
  status: string;
  shots: [string, string];
  accent: string;
  link?: { href: string; label: string };
};

export const work: Work[] = [
  {
    n: "01",
    title: "RentEase",
    kind: "Property management platform",
    year: "2026",
    body: "Rent management for small landlords. Owners track tenants, meter readings, bills and payments; tenants receive itemised bills, pay online and download receipts.",
    points: ["Role-based access for owners, tenants, staff and operators", "Razorpay payments verified on the server", "Reminders by WhatsApp, SMS, email and push"],
    stack: ["Flutter", "FastAPI", "PostgreSQL", "Razorpay", "GitHub Actions"],
    status: "Live",
    shots: ["/img/rentease-1.webp", "/img/rentease-2.webp"],
    accent: "#ff5a36",
    link: { href: "https://rentease-app-hkrb.onrender.com", label: "Open live app" },
  },
  {
    n: "02",
    title: "Money Plan",
    kind: "Personal finance app",
    year: "2026",
    body: "An Android budgeting app that splits monthly income across EMIs, SIPs, savings goals and spending, and logs expenses automatically from bank SMS.",
    points: ["Automatic transaction detection from bank messages", "Savings goals, reminders and overspending alerts", "Fully on-device storage for privacy"],
    stack: ["Flutter", "SQLite", "Android"],
    status: "Play Store ready",
    shots: ["/img/moneyplan-1.webp", "/img/moneyplan-2.webp"],
    accent: "#7c6cff",
  },
  {
    n: "03",
    title: "PunchIn",
    kind: "Workforce attendance",
    year: "2026",
    body: "GPS-verified attendance. Employees can punch in only inside the office radius, and managers see the whole team live, with no backend server to maintain.",
    points: ["Geofenced punch-in with live team map", "Leave requests, approvals and reports", "Invite staff with a QR code"],
    stack: ["Flutter", "Firestore", "Firebase Auth", "FCM"],
    status: "Open source",
    shots: ["/img/punchin-1.webp", "/img/punchin-2.webp"],
    accent: "#16a37f",
    link: { href: "https://github.com/Aniudupa15/WorkTrack", label: "View source" },
  },
];

export const moreWork = [
  { title: "Clean Kudla", kind: "Waste collection monitoring for Mangaluru", stat: "60% better monitoring", href: "https://github.com/Aniudupa15/Clean-Kudla" },
  { title: "Judica", kind: "Legal assistant with ML document analysis", stat: "40% faster legal lookups", href: "https://github.com/Aniudupa15/Judica" },
  { title: "TrackIn", kind: "AI attendance from one group photo", stat: "95% recognition accuracy" },
  { title: "Swach Setu", kind: "MERN dashboard for recovery facilities", stat: "33 waste categories", href: "https://github.com/Aniudupa15/Swach-Sanket" },
];

export const experience = [
  { when: "Jul – Sep 2025", role: "Flutter Developer Intern", org: "Rablo Inovate", note: "Led a team of three developers; built 10+ features and improved app performance by 70%." },
  { when: "Fellowship", role: "District Fellow", org: "Deputy Commissioner's office, Dakshina Kannada", note: "Selected in the top 20 of 600 applicants to work on district initiatives." },
  { when: "2025", role: "Technical Coordinator", org: "Aakriti 2025", note: "Ran 20+ technical events for more than 200 participants." },
  { when: "2022 – now", role: "B.E. Computer Science and Business Systems", org: "Canara Engineering College", note: "CGPA 8.59." },
];

export const awards = [
  { big: "Top 20", of: "of 600", title: "District fellowship" },
  { big: "3rd", of: "of 50+ teams", title: "Hackathon, VVCE Mysore" },
  { big: "Top 10", of: "of 70+", title: "Edu-Vitality National" },
];

export const skills = ["Flutter", "Dart", "FastAPI", "Python", "PostgreSQL", "Firebase", "Firestore", "Razorpay", "SQLAlchemy", "Node.js", "MongoDB", "AWS", "GitHub Actions", "Android", "WhatsApp Cloud API", "FCM"];
