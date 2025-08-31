#PROJECT STRUCTURE


attendance-system-sih2025/
│── backend/              # Node.js + Express + MongoDB
│   ├── config/           # DB connection, environment configs
│   ├── controllers/      # Request handlers (Faculty, Student, Attendance)
│   ├── middlewares/      # Auth, role-based access, error handling
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions (QR, JWT, etc.)
│   ├── server.js         # Entry point for backend
│   ├── package.json
│
│── frontend/             # React / Next.js (depending on choice)
│   ├── public/           # Static files (logos, icons)
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar, Button, QRScanner)
│   │   ├── pages/        # Screens (Login, Dashboard, Attendance)
│   │   ├── hooks/        # Custom hooks (Auth, API calls)
│   │   ├── context/      # Context API / Redux for state management
│   │   ├── services/     # API calls to backend
│   │   ├── App.js        # Root component
│   │   ├── index.js
│   ├── package.json
│
│── .gitignore
│── README.md


