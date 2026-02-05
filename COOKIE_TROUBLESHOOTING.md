# Cookie Persistence Troubleshooting Guide

## Changes Made

### 1. Global Axios Configuration (`src/lib/axios.ts`)
- Set `axios.defaults.withCredentials = true` globally
- Added request/response interceptors for debugging
- All axios requests now automatically send cookies

### 2. Main Entry Point Updated (`src/main.tsx`)
- Imported axios configuration before app renders
- Ensures axios is configured before any API calls

### 3. AuthContext Improvements
- Added console logging for debugging cookie flow
- Changed retry strategy: `retry: 1` (instead of `retry: false`)
- Added `refetchOnMount: true` to always check auth on mount
- Added automatic refetch after login to verify cookie

## Common Cookie Issues & Solutions

### ❌ Issue: Cookies disappear on hard reload

**Possible Causes:**

1. **Backend not setting cookies correctly**
   - Cookie must have `httpOnly: true`
   - Cookie must have `sameSite: 'none'` (for cross-origin) or `sameSite: 'lax'` (same-origin)
   - Cookie must have `secure: true` if using HTTPS
   - Cookie must have proper `domain` and `path`

2. **CORS not configured on backend**
   ```javascript
   // Backend needs:
   app.use(cors({
     origin: 'http://localhost:8082', // Your frontend URL
     credentials: true
   }));
   ```

3. **Cookie maxAge too short**
   ```javascript
   // Backend should set:
   res.cookie('token', jwt, {
     httpOnly: true,
     maxAge: 24 * 60 * 60 * 1000, // 24 hours
     sameSite: 'lax',
     secure: false // true for HTTPS
   });
   ```

### ✅ How to Debug

1. **Check browser DevTools → Application → Cookies**
   - After login, verify cookie exists
   - Check cookie attributes (Domain, Path, Expires, HttpOnly, Secure, SameSite)
   - After reload, check if cookie still exists

2. **Check Console Logs**
   - Look for: "Logging in..."
   - Look for: "Login successful, user data: {...}"
   - Look for: "Fetching current user with cookies..."
   - Look for: "User fetched successfully: {...}"
   - Look for: "Not authenticated or cookies missing"

3. **Check Network Tab**
   - Login request: Should show "Set-Cookie" in Response Headers
   - Subsequent requests: Should show "Cookie" in Request Headers

### 🔧 Backend Cookie Configuration Example

**Express.js:**
```javascript
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8082', // Frontend URL
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Login endpoint
app.post('/auth', (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials...
  
  const token = generateJWT({ email });
  
  res.cookie('authToken', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // or 'none' for cross-origin with secure: true
    secure: false, // true for production HTTPS
    path: '/'
  });
  
  res.json({ id: user.id, email: user.email });
});

// Auth check endpoint
app.get('/auth/me', (req, res) => {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Verify token...
  
  res.json({ id: user.id, email: user.email });
});
```

## Testing Cookie Persistence

1. **Login** → Check cookies in DevTools
2. **Navigate** to another page → Cookie should persist
3. **Hard Reload** (Ctrl+F5) → Cookie should still exist
4. **Close browser** → Reopen → Cookie should persist (if maxAge is set)

## Current Flow

```
User enters credentials
    ↓
POST /auth with credentials
    ↓
Backend validates & sets cookie
    ↓
Frontend stores user in TanStack Query cache
    ↓
Automatic refetch to verify cookie
    ↓
GET /auth/me with cookie
    ↓
Backend validates cookie & returns user
    ↓
User stays logged in

Hard Reload:
    ↓
App loads → AuthProvider initializes
    ↓
TanStack Query runs fetchCurrentUser
    ↓
GET /auth/me with cookie (automatically sent)
    ↓
If cookie valid → User loaded
    ↓
If cookie missing/invalid → User stays null
```

## If Cookies Still Disappear

Check these in order:

1. ✅ Backend sets `Set-Cookie` header in login response
2. ✅ Backend includes `credentials: true` in CORS config
3. ✅ Frontend sends `withCredentials: true` (already configured)
4. ✅ Cookie domain matches current domain
5. ✅ Cookie hasn't expired (check maxAge)
6. ✅ Browser allows cookies (check privacy settings)
7. ✅ Not in incognito/private browsing mode

## Environment Variables

Make sure `.env` has:
```
VITE_SERVER_URL=http://localhost:3000
```

Backend should run on the URL specified in VITE_SERVER_URL.
