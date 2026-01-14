# How to Run the RedBus Clone Project

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

## Steps to Run

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies
```bash
cd frontend/server
npm install
```

### 3. Start the Backend Server
```bash
cd frontend/server
npm start
# or
node index.js
```
The backend will run on http://localhost:5000

### 4. Start the Frontend Development Server
```bash
cd frontend
ng serve
# or
npm start
```
The frontend will run on http://localhost:4200

### 5. Access the Application
Open your browser and navigate to: http://localhost:4200

## Features Available
- ✅ Dark Mode Toggle (working)
- ✅ Rate and Review Bus Routes System (implemented)
- 🔄 Multi-Language Support (implementing now)

## Troubleshooting
- If you get Angular CLI errors, install it globally: `npm install -g @angular/cli`
- Make sure both backend and frontend are running simultaneously
- Check console for any errors and ensure all dependencies are installed