# 📄 Invoice Management System

A modern, responsive invoice management application built with React, Firebase, and real-time WebSocket integration. This application provides a complete solution for creating, managing, and tracking invoices with a beautiful, mobile-first design. You can find the deployed version at https://invoice-app-three-gamma.vercel.app/

## 🚀 Features

### Core Functionality
- **📊 Dashboard**: Real-time overview with statistics and recent activities
- **📝 Invoice Creation**: Comprehensive invoice creation with item management
- **👁️ Invoice Details**: Detailed invoice view with PDF download and sharing
- **📋 Invoice Management**: List, filter, search, and manage all invoices
- **📱 Mobile Responsive**: Optimized for all device sizes

### Authentication & Security
- **🔐 Firebase Authentication**: Email/password login and signup
- **👤 User Management**: Persistent user sessions and profile management
- **🛡️ Error Boundaries**: Graceful error handling throughout the app

### Real-time Features
- **⚡ WebSocket Integration**: Real-time notifications and updates
- **🔔 Activity Feed**: Live activity tracking and notifications
- **📡 Network Status**: Connection monitoring and offline handling
- **🎯 Status Indicators**: Real-time connection status display

### Advanced Features
- **📄 PDF Generation**: Download invoices as PDF documents
- **🔗 Shareable Links**: Generate shareable invoice links
- **💾 Local Storage**: Persistent data storage and caching
- **🎨 Modern UI**: Beautiful design with Tailwind CSS
- **🧪 Comprehensive Testing**: 29+ tests covering core functionality

## 🏗️ Architecture & Approach

### Technology Stack
- **Frontend**: React 18.2.0 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Firebase Auth
- **Real-time**: Socket.IO client
- **PDF Generation**: jsPDF + html2canvas
- **Testing**: Vitest with Testing Library
- **Icons**: Lucide React + Custom SVG components

### Design Philosophy
- **Mobile-First**: Responsive design starting from mobile devices
- **Component-Based**: Modular, reusable React components
- **Context-Driven**: Global state management with React Context
- **Hook-Based**: Custom hooks for business logic separation
- **Error-First**: Comprehensive error handling and user feedback

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── CreateInvoice.jsx # Invoice creation form
│   ├── InvoiceDetail.jsx # Invoice detail modal
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── ErrorContext.jsx # Error management
│   └── LoadingContext.jsx # Loading states
├── hooks/              # Custom React hooks
│   ├── useInvoices.js  # Invoice management logic
│   ├── useActivities.js # Activity feed logic
│   └── ...
├── config/             # Configuration files
│   ├── firebase.js     # Firebase setup
│   └── socket.js       # WebSocket configuration
├── utils/              # Utility functions
│   └── invoiceUtils.js # Invoice-related utilities
└── test/               # Test files
    ├── setup.js        # Test configuration
    ├── basic.test.js   # Basic functionality tests
    ├── core-logic.test.js # Business logic tests
    └── utils/helpers.test.js # Utility function tests
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js**: Version 18.18.0 or higher (tested on 18.18.0)
- **npm**: Version 9.8.1 or higher
- **Firebase Project**: For authentication and real-time features

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Invoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Copy your Firebase configuration to the `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with email and password
2. **Dashboard**: View your invoice statistics and recent activities
3. **Create Invoice**: Click "Create New Invoice" to start creating invoices
4. **Manage Invoices**: View, edit, and manage your invoices from the dashboard

### Creating Invoices
1. Fill in customer information (name, email, phone)
2. Set issue and due dates
3. Add invoice items with descriptions, quantities, and rates
4. Add optional notes
5. Click "Create Invoice" to save

### Invoice Management
- **View Details**: Click on any invoice to view full details
- **Download PDF**: Generate and download PDF versions
- **Share Links**: Create shareable links for invoices
- **Status Updates**: Mark invoices as paid, overdue, or sent
- **Delete**: Remove invoices when no longer needed

### Real-time Features
- **Live Updates**: See real-time notifications and activities
- **Status Indicators**: Monitor connection status
- **Activity Feed**: Track all invoice-related activities

## 🧪 Testing

### Running Tests
```bash
# Run all tests (watch mode)
npm test

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage
- **29 tests** covering core functionality
- **Business logic validation**
- **Utility function testing**
- **Error handling verification**
- **Data structure validation**

### Test Structure
- `basic.test.js`: Basic functionality tests
- `core-logic.test.js`: Business logic and data management
- `utils/helpers.test.js`: Utility function validation

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Recommended for React applications
- **Netlify**: Easy deployment with continuous integration
- **Firebase Hosting**: Integrated with Firebase services
- **GitHub Pages**: Free hosting for public repositories

## 🔧 Configuration

### Environment Variables
All Firebase configuration is stored in environment variables for security:
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Authentication domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID

### Customization
- **Colors**: Modify Tailwind CSS configuration in `tailwind.config.js`
- **Fonts**: Update font family in `src/index.css`
- **Icons**: Add custom icons in `src/assets/icons/`
- **Components**: Extend components in `src/components/`

## 📱 Mobile Responsiveness

### Design Approach
- **Mobile-First**: Designed for mobile devices first
- **Progressive Enhancement**: Enhanced for larger screens
- **Touch-Friendly**: Optimized for touch interactions
- **Responsive Breakpoints**: Tailwind CSS responsive utilities

### Supported Devices
- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## 🔒 Security Considerations

### Data Protection
- **Client-Side Validation**: Form validation and error handling
- **Firebase Security**: Server-side authentication and authorization
- **Environment Variables**: Sensitive data stored securely
- **Error Boundaries**: Graceful error handling without data exposure

### Authentication
- **Firebase Auth**: Industry-standard authentication
- **Persistent Sessions**: Secure session management
- **Password Security**: Firebase handles password security
- **User Management**: Secure user profile management

## 🐛 Troubleshooting

### Common Issues

**Firebase Authentication Errors**
- Verify Firebase configuration in `.env` file
- Check Firebase project settings
- Ensure Authentication is enabled in Firebase Console

**PDF Generation Issues**
- Check browser compatibility
- Verify jsPDF and html2canvas dependencies
- Ensure invoice content is properly rendered

**Real-time Connection Issues**
- Check network connectivity
- Verify Socket.IO configuration
- Review browser console for WebSocket errors

**Testing Issues**
- Ensure Node.js version compatibility
- Check test dependencies installation
- Verify test configuration files

### Debug Mode
Enable debug logging by checking browser console for detailed error messages and Firebase authentication logs.

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards
- **ESLint**: Follow configured linting rules
- **Component Structure**: Use functional components with hooks
- **Naming Conventions**: Use descriptive, camelCase naming
- **Documentation**: Comment complex logic and components

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the test files for usage examples
- Examine component implementations for reference
- Check browser console for error messages

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: Internationalization
- **Advanced Reporting**: Analytics and reporting features
- **Payment Integration**: Payment gateway integration
- **Team Collaboration**: Multi-user invoice management
- **API Integration**: REST API for external integrations

### Technical Improvements
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG compliance improvements
- **PWA Features**: Progressive Web App capabilities
- **Offline Support**: Enhanced offline functionality

---

**Built with ❤️ using React, Firebase, and modern web technologies.**
