# Authentication decisions

## Current approach

- The backend is authoritative for whether an authentication session is valid.
- The frontend stores `mountWindIsLoggedIn` in `localStorage` as a UI hint so the logged-in interface survives page refreshes. It is not proof of authentication.
- A successful login or registration sets the frontend flag. A successful logout removes it.
- The backend session currently lives in memory and is lost when the service restarts. MongoDB persistence is planned for a later step.
- The auth token is held in an HTTP-only cookie and sent by `fetch` with `credentials: 'include'`.
- Username is not part of the frontend authentication state. The connect page's hosted-game data is currently placeholder data.

## When protected endpoints are added

- Attach `verifyAuth` to each endpoint that requires a logged-in user. Leave login and registration accessible without an existing session.
- When a protected request returns `401 Unauthorized`, clear both the React login state and `mountWindIsLoggedIn`, then direct the user to login as appropriate.
- Do not use every `401` as a session-expiry signal: login can return `401` for invalid credentials. Handle authentication endpoint responses in their own flows.
- A `500` response does not by itself mean the session is invalid and should not clear the login flag.

## Session persistence

The current auth cookie has no explicit expiration, so it is a browser session cookie. If users should remain logged in after closing and reopening the browser, configure a persistent cookie and enforce the corresponding session lifetime on the backend. Closing a tab is not a reliable signal to log out; no browser-close logout request is planned.

## Session status endpoint

A separate session-check endpoint is not necessary while the frontend only uses the login, registration, and logout endpoints. Consider adding one if the app needs to revalidate and restore its UI state from the backend when it starts.
