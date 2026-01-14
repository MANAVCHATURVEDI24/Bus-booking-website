# 🚌 TedBus - Online Bus Booking Platform

A full-stack MEAN (MongoDB, Express, Angular, Node.js) application for online bus ticket booking with advanced features including multi-language support, dark mode, interactive route planning, and community features.

![Angular](https://img.shields.io/badge/Angular-17.3.0-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.6.2-green?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue?logo=typescript)

## ✨ Features

### Core Functionality
- 🎫 **Bus Ticket Booking** - Search, select seats, and book bus tickets
- 💺 **Interactive Seat Selection** - Visual seat layout with real-time availability
- 💳 **Payment Integration** - Secure payment processing with booking confirmation
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🔐 **Google OAuth Authentication** - Secure login with Google accounts

### Advanced Features
- 🌍 **Multi-Language Support** - 6 languages (English, Spanish, French, German, Portuguese, Italian)
- 🌙 **Dark/Light Theme Toggle** - User preference with localStorage persistence
- 🗺️ **Interactive Route Planning** - Real-time traffic updates and route optimization
- ⭐ **Rating & Review System** - User reviews with multi-criteria ratings
- 👥 **Community Features** - Travel stories and discussion forums
- 🔔 **Notification System** - Real-time booking updates and alerts
- 🎟️ **My Trips Dashboard** - View and manage all bookings
- 🚫 **Duplicate Booking Prevention** - Automatic detection and prevention

### User Experience
- 🎨 **Professional UI/UX** - Clean, modern interface with smooth animations
- ♿ **Accessibility Compliant** - WCAG AAA contrast ratios
- 🔄 **Real-time Updates** - Live seat availability and booking status
- 📊 **Smart Search** - Intelligent location search with suggestions
- 💾 **Auto-save Preferences** - Language and theme preferences saved

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 17.3.0
- **UI Components**: Angular Material 17.3.8
- **Styling**: Tailwind CSS
- **State Management**: RxJS 7.8.0
- **Language**: TypeScript 5.4.2
- **Build Tool**: Angular CLI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB 6.6.2
- **ODM**: Mongoose 8.4.0
- **Authentication**: Google OAuth 2.0
- **API**: RESTful architecture

### Additional Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Development**: Nodemon (auto-restart)
- **CORS**: Enabled for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Angular CLI** - Install globally: `npm install -g @angular/cli`
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tedbus.git
cd tedbus
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd frontend/server

# Install dependencies
npm install

# Start MongoDB (if not running as service)
# Windows: mongod
# Mac/Linux: sudo systemctl start mongod

# Seed the database with sample data
node seedDatabase.js

# Start the backend server
npm start
```

The backend server will run on **http://localhost:5001**

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start the development server
ng serve
```

The frontend will run on **http://localhost:4200**

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5001/api

## 📁 Project Structure

```
tedbus/
├── frontend/                    # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── Component/      # Angular components
│   │   │   ├── service/        # Services (API, theme, language)
│   │   │   ├── model/          # TypeScript models
│   │   │   ├── pipes/          # Custom pipes (translate)
│   │   │   └── config/         # Configuration files
│   │   ├── assets/             # Images and static files
│   │   └── styles.css          # Global styles
│   ├── server/                 # Node.js backend
│   │   ├── controller/         # Route controllers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── index.js            # Server entry point
│   │   └── seedDatabase.js     # Database seeding script
│   ├── angular.json            # Angular configuration
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.js      # Tailwind configuration
├── *.md                        # Documentation files
└── README.md                   # This file
```

## 🎯 Available Routes

### Frontend Routes
- `/` - Landing page with search
- `/select-bus` - Bus listing and selection
- `/payment` - Payment and booking confirmation
- `/profile` - User profile and settings
- `/community` - Community stories and forums
- `/route-planner` - Interactive route planning

### Backend API Endpoints
- `POST /api/customer` - User authentication
- `GET /api/bus` - Get available buses
- `POST /api/booking` - Create booking
- `GET /api/booking/:email` - Get user bookings
- `POST /api/review` - Submit review
- `GET /api/notifications/:email` - Get notifications

## 🌐 Multi-Language Support

The application supports 6 languages:
- 🇺🇸 English (EN)
- 🇪🇸 Spanish (ES)
- 🇫🇷 French (FR)
- 🇩🇪 German (DE)
- 🇵🇹 Portuguese (PT)
- 🇮🇹 Italian (IT)

Language preference is automatically saved and persists across sessions.

## 🎨 Theme Support

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Reduced eye strain with dark backgrounds
- **Auto-detection**: Respects system theme preference
- **Persistence**: Theme choice saved in localStorage

## 📊 Sample Data

The application comes with pre-seeded data:

**Routes Available:**
1. Delhi → Jaipur
2. Mumbai → Goa
3. Bangalore → Mysore
4. Kolkata → Darjeeling
5. Chennai → Pondicherry

**Sample Buses:** 10 buses with various amenities (AC, WiFi, Charging ports)

## 🔧 Configuration

### MongoDB Connection
Update the MongoDB connection string in `frontend/server/index.js`:
```javascript
mongoose.connect('mongodb://localhost:27017/tedbus')
```

### Port Configuration
- **Backend Port**: 5001 (configurable in `frontend/server/index.js`)
- **Frontend Port**: 4200 (default Angular port)

### Google OAuth (Optional)
To enable Google login, add your client ID in `frontend/src/app/Component/navbar/navbar.component.ts`

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
ng test

# Run backend tests (if configured)
cd frontend/server
npm test
```

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
ng build --configuration production
```
Output will be in `frontend/dist/`

### Backend Deployment
The backend is production-ready. Ensure MongoDB connection string points to production database.

## 🚀 Deployment Options

### Frontend
- **Vercel**: Automatic Angular detection
- **Netlify**: Deploy `dist` folder
- **GitHub Pages**: Static hosting

### Backend
- **Render.com**: Free Node.js hosting
- **Railway.app**: Full-stack deployment
- **Heroku**: Traditional PaaS

### Database
- **MongoDB Atlas**: Free cloud MongoDB hosting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

Detailed documentation available in the project:
- `deployment-guide.md` - Deployment instructions
- `booking-system-guide.md` - Booking system details
- `theme-guide.md` - Theme implementation
- `localization-guide.md` - Multi-language setup
- `notifications.md` - Notification system
- `project-documentation.md` - Complete documentation index

## 🐛 Known Issues

- Language change requires page reload for full translation
- Google OAuth requires valid client ID configuration
- Some features require active MongoDB connection

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Girish Maharana**
- Email: girishmaharana42@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by [RedBus](https://www.redbus.in/)
- Angular Material for UI components
- MongoDB for database solutions
- Google for OAuth authentication

## 📞 Support

For support, email girishmaharana42@gmail.com or open an issue in the repository.

---

**⭐ If you find this project useful, please consider giving it a star!**

*Last Updated: January 2026*
