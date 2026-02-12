# Valentine App

This repository is a small single-page Valentine experience with a Node.js backend that emails the collected responses to a recipient.

Quick start

1. Copy `.env.sample` to `.env` and fill in your SMTP or Gmail values. For Gmail you should create an App Password and use that in `EMAIL_PASS`.

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open http://localhost:3000/valentine.html in your browser to preview the app.

Notes

- The server will serve static files from the repository root so you can preview the front-end and the backend together.
- If you want to run in development with automatic restarts, install `nodemon` globally or run `npx nodemon server.js`.

Security

- Do not commit `.env` with real credentials to version control. Use `.env.sample` as a template.
