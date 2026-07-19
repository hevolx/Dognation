# Dognation

Dognation is a collaborative site for dogwalkers to share pictures of their buddies. Users can sign in and post pictures of the dogs they walk, sharing them with everyone else on the platform.

## Motivation

This project originates from Codecademy and was about implementing a missing feature in an existing app: user authentication. Boilerplate code was already provided, but it had no configuration for registering, logging in, staying logged in, or logging out. The task was to complete this using `express-session`, Passport's `passport-local` strategy, and `bcrypt.js` for secure password handling.

## Tech/framework used

<b>Built with</b>

- [Express](https://expressjs.com/) 5
- [Passport](https://www.passportjs.org/) with `passport-local`
- [express-session](https://github.com/expressjs/session)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [EJS](https://ejs.co/) as the view engine
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) for testing

## Features

- User registration with passwords hashed via bcrypt before being stored
- Login through Passport's local strategy, comparing against the hashed password
- Session handling with `express-session` so logged-in users stay authenticated
- User serialization/deserialization via Passport so `req.user` is available on every request
- Logout that ends the session
- The home page shows the logged-in user, or "Guest" otherwise

## Installation

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following variable:

   ```
   SESSION=<a random secret string>
   ```

3. Start the server:

   ```bash
   node app.js
   ```

   The server listens on port `4001` by default (configurable via the `PORT` environment variable).

## Tests

Tests are run with Jest:

```bash
npm test
```

The test suite lives in `test/` and is organized by topic (bcrypt, Passport initialization, serialization, sessions, and route tests for login/logout/home).

## How to use?

1. Go to `/users/register` and create an account with a username and password.
2. Log in via `/users/login`.
3. On successful login you're redirected to the home page (`/`), where your username is displayed.
4. Log out via `/users/logout`.

## Project structure

```
app.js                    # Express app, session and Passport configuration
config/passport.js        # Passport's local strategy plus serialize/deserialize
routes/                   # index and users routes (register, login, logout)
helpers/helper.js         # Helper functions for looking up/writing user data
data/users.json           # Simple JSON-based "database" for users
views/                    # EJS views for home, login, and register
test/                     # Jest/Supertest tests
```

## License

MIT
