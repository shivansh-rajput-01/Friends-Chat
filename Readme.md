# Friends-Chat - Real-Time Chat Application

Friends-Chat is a full-stack real-time messaging platform built using Node.js, Express, Socket.io, and MongoDB. The application enables users to connect securely using permanent or user-specific temporary secret codes, exchange messages in real-time, and monitor live user status.

Live Demo: https://friends-chat-wsty.onrender.com/
Repository: https://github.com/shivansh-rajput-01/Friends-Chat

---

## Tech Stack

[<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">](https://developer.mozilla.org/en-US/docs/Web/HTML)
[<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">](https://developer.mozilla.org/en-US/docs/Web/CSS)
[<img src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black">](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[<img src="https://img.shields.io/badge/socket.io-%23010101.svg?style=for-the-badge&logo=socket.io&logoColor=white">](https://socket.io/)
[<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">](https://expressjs.com/)
[<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">](https://www.mongodb.com/)
[<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">](https://nodejs.org/)

* Backend: Node.js, Express.js, Socket.io
* Database: MongoDB Atlas, Mongoose ODM
* Templating Engine: EJS (Embedded JavaScript)
* Authentication: Passport.js
* Frontend: HTML, CSS, Bootstrap, JavaScript, WebSockets

---

## Key Features

* User Authentication: Secure sign up and login via JWT, Bcrypt and cookies.
* Secure Code Sharing System: Support for permanent share codes and user-specific temporary secret codes designed for privacy and instant connection.
* One-Time Code Destruction: Automatic removal of used temporary secret codes from the database via MongoDB pull operators.
* Real-Time Messaging: Instant bi-directional message delivery and live sidebar updates powered by Socket.io.
* Live Online Status and Last Seen: Real-time user connectivity tracking with grace period logic to handle page refreshes seamlessly.
* Live Typing Indicators: Instant visual feedback when a contact is typing a message in the active chat room.
* Advanced Search Filter: Real-time keyword filtering across chat lists for quick contact lookup.
* Localized Timestamp Formatting: Dynamic date organization and time display for messages.

---

## Project Structure

```text
friends-chat/
│
├── controllers/     # Route logic and request handlers
├── models/          # Mongoose schemas
├── public/          # Static assets and frontend scripts
├── routes/          # Express router modules
├── utils/           # Utility functions and formatters
├── views/           # EJS frontend templates
├── app.js           # Main application entry point and socket configuration
├── middleware.js    # Custom authentication middlewares
└── package.json     # Project metadata and dependencies


## Getting Started Locally

To run this project on a local machine, follow these steps:

1. Clone the repository
   git clone https://github.com/shivansh-rajput-01/Friends-Chat.git
   cd Friends-Chat

2. Install dependencies
   npm install

3. Setup Environment Variables
   Create a file named .env in the root directory and add the following configuration:
   MONGO_URL=your_mongodb_connection_string
   SECRET=yoursessionsecret

4. Start the Server
   node app.js

Open http://localhost:3000 in a web browser.

## Author

Shivansh Rajput