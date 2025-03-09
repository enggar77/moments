# React + Vite - MOMENTS

MOMENTS is a **Concert Ticket Sale** platform, designed to facilitate ticket purchasing, event management, and user access control. The system includes three main roles:

- **Admin**: Manages users, events, and sales data.
- **Organizer**: Creates and manages concert events.
- **User**: Browses and purchases tickets for concerts.

## Features
- ⚡ Fast Refresh with Vite
- 🎟️ Ticket purchasing system
- 📅 Event management for organizers
- 🔐 Role-based authentication
- ✅ Testing with Vitest
- 🛠️ Backend powered by Convex
- 🚀 Ready for Production

## Installation & Setup

Follow these steps to get started:

```bash
# Clone the repository
git clone https://git.enigmacamp.com/enigma-camp/enigmacamp-2.0/batch-39-react-js-and-native/team/prea/moments-project-baru.git

# Navigate into the project directory
cd moments-project-baru

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Using Convex for Backend

This project utilizes **Convex** as the backend to handle data storage, queries, and mutations efficiently. Convex provides a serverless database with real-time updates, making it an ideal choice for managing concert ticket sales dynamically.

### Convex Features in This Project
- **Serverless data storage**: No need to manage a traditional database; Convex handles everything.
- **Real-time event updates**: Organizers can create and update concerts, and users will see changes instantly.
- **User authentication & roles**: Convex helps manage different user roles (Admin, Organizer, User).
- **Data queries & mutations**: Secure and optimized database interactions for ticket purchases and event management.

To get started with Convex locally:
```bash
# Initialize Convex (if not already set up)
npx convex dev
```

## Scripts

The following scripts are available for development and testing:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "coverage": "vitest --ui --coverage.enabled=true"
}
```

- **`dev`**: Starts the development server with HMR (Hot Module Replacement).
- **`build`**: Bundles the application for production.
- **`lint`**: Runs ESLint to check for code style and potential errors.
- **`preview`**: Serves the built project locally for previewing.
- **`test`**: Runs unit tests using Vitest.
- **`coverage`**: Generates a test coverage report with Vitest.

## Testing

To run tests and check coverage:

```bash
# Run tests
npm run test

# Check test coverage
npm run coverage
```

## Deployment

To build and deploy the application:

```bash
# Build for production
npm run build

# Deploy using Vercel
vercel deploy
```

## Contributing

If you want to contribute, follow these steps:

```bash
# Fork the repo and create a new branch
git checkout -b feature-branch

# Make changes, commit, and push
git commit -m "Add new feature"
git push origin feature-branch

# Create a pull request
```

---
