# Attendance-System

This repository contains the codebase for the Attendance-System, developed as part of the Smart India Hackathon (SIH) project. The Attendance-System is designed to streamline and automate attendance t[...]

## Features

- Automated attendance tracking
- User-friendly interface
- Real-time data updates
- Secure authentication
- Comprehensive reporting tools

## Technologies Used

- JavaScript (main language)
- Additional supporting technologies

## Getting Started

### Prerequisites

- Node.js and npm installed
- Web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xfgryv/Attendance-System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Attendance-System
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm start
```
Open your frontend localhost ("http://localhost:5174") to access the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## Working Members

This project was developed by the following team members:
- Sagar
- Pavitra
- Devraj
- Shreeja
- Nupur
- Ayush

---

## Environment Variables

### Frontend (`.env`)

```
VITE_API_BASE_URL=your backend localhost
```

### Backend (`.env`)

```
PORT=give your port number
MONGODB_URL=your db connection string
CORS_ORIGIN=your frontend localhost
ACCESS_TOKEN_SECRET=your secret
ACCESS_TOKEN_EXPIRES_IN=days(10d)

CLOUDINARY_CLOUD_NAME=your cloudinary account name
CLOUDINARY_API_KEY=your cloudinary api key
CLOUDINARY_API_SECRET=your cloudinary api secret
QR_CODE_SECRET=your qr_secret
```

---

**Note:** This project is not fully completed right now. We will integrate an online class attendance system in the future. Currently, only the offline class attendance system has been integrated.
