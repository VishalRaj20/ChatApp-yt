# Realtime Responsive 💬Chat App

<img src="https://github.com/VishalRaj20/ChatApp/blob/925e858f43e3931a50ee4a828ced3f30d3b93469/Client/src/assets/ChatApp%20UI.png" alt="Chat App UI Preview" />
<img src="https://github.com/VishalRaj20/ChatApp/blob/bab58ad30de137ac6ba24ff2d812525d3002510c/Client/src/assets/ChatView.png" alt="Chat UI Preview" />

A full-stack realtime chat application built with React, Vite, Express, MongoDB, and Socket.IO. Users can sign up, complete a profile, search contacts, chat one-to-one, create channels, exchange files, and receive messages instantly through WebSocket events.

## Features

- User authentication with signup, login, logout, JWT cookies, and bcrypt password hashing
- Protected routes for chat and profile pages
- Profile setup with first name, last name, avatar upload/removal, and color selection
- Realtime direct messaging with Socket.IO
- Channel/group chat with admins, members, and channel message history
- Contact search and recent direct-message contact list
- File and image sharing through server-side uploads
- Read-state support for messages
- Responsive React UI with Tailwind CSS, Radix UI components, lucide icons, Zustand state, and toast notifications

## Tech Stack

### Client

- React 19
- Vite 6
- React Router
- Zustand
- Axios
- Socket.IO Client
- Tailwind CSS 4
- Radix UI
- Lucide React
- Emoji Picker React
- React Hot Toast / Sonner

### Server

- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT
- bcrypt
- cookie-parser
- cors
- multer
- dotenv
- nodemon

## Project Structure

```text
Chat/
|-- Client/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/ui/
|   |   |-- context/
|   |   |   `-- SocketContext.jsx
|   |   |-- lib/
|   |   |   `-- api-client.js
|   |   |-- pages/
|   |   |   |-- auth/
|   |   |   |-- chat/
|   |   |   `-- profile/
|   |   |-- store/
|   |   |   `-- slices/
|   |   |-- utils/
|   |   |   `-- constants.js
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- Server/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- uploads/
|   |-- Index.js
|   |-- socket.js
|   `-- package.json
`-- README.md
```

## Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create a `.env` file inside `Server/`:

```env
PORT=3001
DATABASE_URL=mongodb://127.0.0.1:27017/chat-app
JWT_SECRET=your_jwt_secret
ORIGIN=http://localhost:5173
```

Create a `.env` file inside `Client/`:

```env
VITE_SERVER_URL=http://localhost:3001
```

## Installation

Install server dependencies:

```bash
cd Server
npm install
```

Install client dependencies:

```bash
cd ../Client
npm install
```

## Run Locally

Start the backend server:

```bash
cd Server
npm run dev
```

Start the frontend app in another terminal:

```bash
cd Client
npm run dev
```

By default:

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```bash
npm run dev
npm start
npm run build
```

## Main API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/user-info`
- `POST /api/auth/update-profile`
- `POST /api/auth/add-profile-image`
- `DELETE /api/auth/remove-profile-image`
- `POST /api/auth/logout`

### Contacts

- `POST /api/contacts/search`
- `GET /api/contacts/get-contacts-for-dm`
- `GET /api/contacts/get-all-contacts`

### Messages

- `POST /api/messages/get-messages`
- `POST /api/messages/upload-file`

### Channels

- `POST /api/channel/create-channel`
- `GET /api/channel/get-user-channels`
- `GET /api/channel/get-channel-messages/:channelId`

## Socket Events

The client connects to the server with the logged-in user's id:

```js
io(HOST, {
  withCredentials: true,
  query: { userId: userInfo.id },
});
```

Main events:

- `sendMessage` sends a direct message
- `messageReceived` receives a direct message
- `send-channel-message` sends a channel message
- `recieve-channel-message` receives a channel message
- `markAsRead` marks messages as read
- `messagesReadUpdate` updates read status for the sender

## Notes

- Uploaded profile images are served from `/uploads/profiles`.
- Uploaded files are served from `/uploads/files`.
- The backend CORS setup expects the frontend to run on `http://localhost:5173` during development.
- Authentication uses an HTTP cookie named `jwt`, so client requests that need authentication must include credentials.
npm
- MongoDB (Local or Atlas)
