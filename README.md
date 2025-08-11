# 🚗 Car Rental Platform

A comprehensive, full-stack car rental application built with modern web technologies, designed specifically for the Indian market. This platform enables users to rent cars from private owners and allows car owners to list and manage their vehicles.

## 🌐 Live Demo

*🚀 Live Website*: [Car Rental Platform]((https://car-rental-bay-rho.vercel.app/))

> *Note*: The live demo is fully functional with all features including user registration, car listings, booking system, and owner dashboard.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Key Features Explained](#-key-features-explained)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🚀 Core Functionality
- *User Authentication*: Secure registration with email OTP verification
- *Car Listings*: Comprehensive car catalog with detailed information
- *Advanced Search*: Location-based search with date availability
- *Booking System*: Complete booking lifecycle management
- *Owner Dashboard*: Full car management for vehicle owners
- *Review System*: Customer ratings and feedback
- *Notification System*: Real-time updates for bookings and activities

### 🎯 User Experience
- *Responsive Design*: Mobile-first approach with Tailwind CSS
- *Modern UI/UX*: Beautiful animations and smooth interactions
- *Real-time Updates*: Live availability checking and booking status
- *Multi-language Support*: Indian states and cities coverage
- *Accessibility*: Screen reader friendly with proper ARIA labels

### 🔒 Security Features
- *JWT Authentication*: Secure token-based authentication
- *Password Hashing*: Bcrypt encryption for user passwords
- *Email Verification*: OTP-based email verification for registration
- *Role-based Access*: Separate user and owner permissions
- *Input Validation*: Comprehensive server-side validation
- *File Upload Security*: Image type and size validation

### 📱 Platform Coverage
- *Geographic Focus*: Comprehensive coverage of Indian states and cities
- *Multi-device Support*: Responsive design for all screen sizes
- *Cross-browser Compatibility*: Works on all modern browsers
- *Progressive Web App*: Fast loading and offline capabilities

## 🛠 Technology Stack

### Frontend
- *React 19*: Latest React with modern hooks and features
- *Vite*: Fast build tool and development server
- *Tailwind CSS v4*: Utility-first CSS framework
- *React Router DOM v7*: Client-side routing
- *Axios*: HTTP client for API communication
- *Motion*: Animation library for smooth transitions
- *React Hot Toast*: Notification system

### Backend
- *Node.js*: JavaScript runtime environment
- *Express.js*: Web application framework
- *MongoDB*: NoSQL database
- *Mongoose*: MongoDB object modeling
- *JWT*: JSON Web Token authentication
- *Bcrypt*: Password hashing
- *Multer*: File upload handling
- *Nodemailer*: Email functionality
- *ImageKit*: Cloud image management

### Development Tools
- *ESLint*: Code quality and consistency
- *Nodemon*: Development server with auto-restart
- *Git*: Version control system

## 🏗 Project Structure


CarRental-main/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons, and static resources
│   │   ├── components/              # Reusable UI components
│   │   │   ├── owner/               # Owner-specific components
│   │   │   └── ...                  # General components
│   │   ├── context/                 # React Context for state management
│   │   ├── data/                    # Static data (state-city mapping)
│   │   ├── pages/                   # Route-specific page components
│   │   │   ├── owner/               # Owner dashboard pages
│   │   │   └── ...                  # General pages
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx                  # Main application component
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── vercel.json                  # Vercel deployment config
├── server/                          # Backend Node.js application
│   ├── configs/                     # Configuration files
│   │   ├── db.js                    # Database connection
│   │   ├── emailConfig.js           # Email configuration
│   │   └── imageKit.js              # ImageKit configuration
│   ├── controllers/                 # Business logic handlers
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # MongoDB schemas
│   ├── routes/                      # API endpoint definitions
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Main server file
│   └── vercel.json                  # Vercel deployment config
├── package-lock.json                # Dependency lock file
└── .gitignore                       # Git ignore rules


## 🚀 Quick Start

*Want to see it in action?* 🎯  
Visit the [Live Demo](https://car-rental-bay-rho.vercel.app/) to explore all features without any setup!

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Email service (for OTP verification)
- ImageKit account (for image uploads)

### Backend Setup

1. *Clone the repository*
   bash
   git clone <https://github.com/VishalThakur001/CarRental>
   cd CarRental-main/server
   

2. *Install dependencies*
   bash
   npm install
   

3. *Environment Configuration*
   Create a .env file in the server directory:
   env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   PORT=3000
   

4. *Start the server*
   bash
   # Development mode
   npm run server
   
   # Production mode
   npm start
   

### Frontend Setup

1. *Navigate to client directory*
   bash
   cd ../client
   

2. *Install dependencies*
   bash
   npm install
   

3. *Environment Configuration*
   Create a .env file in the client directory:
   env
   VITE_BASE_URL=http://localhost:3000
   VITE_CURRENCY=₹
   

4. *Start the development server*
   bash
   npm run dev
   

## 🔧 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| EMAIL_USER | Email address for sending OTPs | Yes |
| EMAIL_PASS | Email password/app password | Yes |
| IMAGEKIT_PUBLIC_KEY | ImageKit public key | Yes |
| IMAGEKIT_PRIVATE_KEY | ImageKit private key | Yes |
| IMAGEKIT_URL_ENDPOINT | ImageKit URL endpoint | Yes |
| PORT | Server port (default: 3000) | No |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_BASE_URL | Backend API base URL | Yes |
| VITE_CURRENCY | Currency symbol for display | Yes |

## 🌐 API Endpoints

### Authentication
- POST /api/user/register - User registration with OTP
- POST /api/user/login - User login
- GET /api/user/data - Get user profile data
- POST /api/user/update-image - Update profile image

### Car Management
- GET /api/user/cars - Get all available cars
- POST /api/owner/add-car - Add new car (owner only)
- GET /api/owner/cars - Get owner's cars
- PUT /api/owner/edit-car/:id - Edit car details
- DELETE /api/owner/delete-car/:id - Delete car
- PUT /api/owner/toggle-availability/:id - Toggle car availability

### Booking System
- POST /api/bookings/create - Create new booking
- GET /api/bookings/user - Get user's bookings
- GET /api/bookings/owner - Get owner's bookings
- PUT /api/bookings/status/:id - Update booking status
- POST /api/bookings/cancel/:id - Cancel booking
- GET /api/bookings/car/:id/dates - Get car's booked dates

### Reviews & Ratings
- POST /api/reviews/create - Create review
- GET /api/reviews/car/:id - Get car reviews
- PUT /api/reviews/edit/:id - Edit review
- DELETE /api/reviews/delete/:id - Delete review

### Notifications
- GET /api/notifications - Get user notifications
- PUT /api/notifications/read/:id - Mark notification as read

### OTP Verification
- POST /api/otp/send - Send OTP to email
- POST /api/otp/verify - Verify OTP

## 🗄 Database Schema

### User Model
javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["owner", "user"], default: "user"),
  image: String (default: ""),
  timestamps: true
}


### Car Model
javascript
{
  owner: ObjectId (ref: User, required),
  brand: String (required),
  model: String (required),
  image: String (required),
  year: Number (required),
  category: String (required),
  seating_capacity: Number (required),
  fuel_type: String (required),
  transmission: String (required),
  pricePerDay: Number (required),
  location: String (required),
  address: {
    street: String,
    city: String (required),
    state: String (required),
    zipCode: String,
    landmark: String
  },
  description: String (required),
  isAvaliable: Boolean (default: true),
  timestamps: true
}


### Booking Model
javascript
{
  car: ObjectId (ref: Car, required),
  user: ObjectId (ref: User, required),
  owner: ObjectId (ref: User, required),
  pickupDate: Date (required),
  returnDate: Date (required),
  status: String (enum: ["pending", "booked", "on_rent", "cancelled", "completed"]),
  price: Number (required),
  cancellationReason: String (default: ""),
  completedAt: Date,
  timestamps: true
}


### Review Model
javascript
{
  car: ObjectId (ref: Car, required),
  user: ObjectId (ref: User, required),
  rating: Number (required, 1-5),
  comment: String (required),
  ownerReply: String (default: ""),
  timestamps: true
}


### OTP Model
javascript
{
  email: String (required),
  otp: String (required),
  verified: Boolean (default: false),
  expiresAt: Date (required),
  timestamps: true
}


### Notification Model
javascript
{
  user: ObjectId (ref: User, required),
  type: String (required),
  title: String (required),
  message: String (required),
  relatedId: ObjectId,
  isRead: Boolean (default: false),
  timestamps: true
}


## 🔑 Key Features Explained

### 1. User Authentication System
- *Registration Flow*: Email verification with OTP before account creation
- *Secure Login*: JWT-based authentication with password hashing
- *Session Management*: Automatic token validation and refresh
- *Role Management*: Separate user and owner roles with different permissions

### 2. Car Search & Discovery
- *Advanced Filtering*: Brand, category, fuel type, transmission, seating capacity, price range
- *Location-based Search*: State and city selection with comprehensive Indian coverage
- *Date Availability*: Real-time checking of car availability for specific dates
- *Smart Sorting*: Price, rating, and popularity-based sorting options

### 3. Booking Management
- *Flexible Date Selection*: Pickup and return date picker with availability checking
- *Price Calculation*: Automatic daily rate calculation including pickup day
- *Status Tracking*: Complete booking lifecycle from pending to completed
- *Cancellation Handling*: User and owner cancellation with reason tracking

### 4. Owner Dashboard
- *Car Management*: Add, edit, delete, and toggle availability of cars
- *Booking Overview*: View and manage all incoming booking requests
- *Revenue Tracking*: Monthly revenue calculation and analytics
- *Review Management*: Respond to customer reviews and ratings

### 5. Review & Rating System
- *Customer Feedback*: Star ratings (1-5) with detailed comments
- *Owner Responses*: Car owners can reply to customer reviews
- *Quality Assurance*: Review moderation and spam prevention
- *Rating Analytics*: Average ratings and review counts for cars

### 6. Notification System
- *Real-time Updates*: Instant notifications for booking status changes
- *Email Notifications*: OTP delivery and important updates
- *In-app Notifications*: User-friendly notification center
- *Smart Cleanup*: Automatic cleanup of old notifications

## 🚀 Deployment

### 🌐 Live Production Status
The application is currently *LIVE* and deployed on Vercel:

- *✅ Production Ready*: All features are fully functional
- *🔒 Secure*: HTTPS enabled with proper security headers
- *📱 Responsive*: Optimized for all devices and browsers
- *⚡ Fast*: CDN optimized with Vercel's edge network

### Vercel Deployment
The application is configured for easy deployment on Vercel:

1. *Backend Deployment*
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy from the server directory

2. *Frontend Deployment*
   - Deploy from the client directory
   - Update VITE_BASE_URL to point to your deployed backend
   - Configure custom domain if needed

### Environment Setup for Production
- Use production MongoDB cluster
- Configure production email service
- Set strong JWT secrets
- Enable HTTPS and security headers
- Configure CORS for production domains

## 🤝 Contributing

### Development Guidelines
1. *Code Style*: Follow ESLint configuration and React best practices
2. *Component Structure*: Use functional components with hooks
3. *State Management*: Utilize React Context for global state
4. *API Design*: RESTful API endpoints with proper error handling
5. *Testing*: Write tests for critical functionality
6. *Documentation*: Update README and code comments

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with detailed description

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach:
- *Responsive Grid*: Flexible layouts for all screen sizes
- *Touch-friendly*: Optimized for mobile interactions
- *Progressive Enhancement*: Core functionality works on all devices
- *Performance*: Optimized loading for mobile networks

## 🔒 Security Considerations

- *Input Validation*: Server-side validation for all user inputs
- *SQL Injection Prevention*: MongoDB with Mongoose ODM
- *XSS Protection*: Sanitized user inputs and outputs
- *CSRF Protection*: JWT-based authentication
- *File Upload Security*: Image type and size validation
- *Rate Limiting*: API request throttling (can be implemented)

## 📊 Performance Features

- *Image Optimization*: Cloud-based image management with ImageKit
- *Lazy Loading*: Components and images load on demand
- *Caching*: Browser caching for static assets
- *Code Splitting*: Route-based code splitting for faster loading
- *Optimized Bundles*: Vite build optimization

## 🌍 Geographic Coverage

The application provides comprehensive coverage for India:
- *28 States*: All Indian states and union territories
- *500+ Cities*: Major cities and towns across India
- *Localized Content*: Indian currency (₹) and date formats
- *Regional Support*: State-specific car availability

## 🔮 Future Enhancements

- *Payment Integration*: Online payment gateways
- *GPS Tracking*: Real-time car location tracking
- *Insurance Integration*: Car insurance services
- *Multi-language Support*: Regional language support
- *Mobile App*: Native iOS and Android applications
- *AI Recommendations*: Smart car suggestions
- *Analytics Dashboard*: Advanced business insights

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the help center within the application

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS approach
- MongoDB for the flexible database solution
- ImageKit for cloud image management
- All contributors and beta testers

---

*Built with ❤ for the Indian car rental market*
