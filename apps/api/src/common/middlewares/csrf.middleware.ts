import { Request, Response, NextFunction } from 'express';
import csurf = require('csurf');

const csrfProtection = csurf({
  cookie: {
    key: '_csrf',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
  value: (req: Request) => {
    // Check both X-XSRF-TOKEN (Axios default) and custom headers
    const token = req.headers['x-xsrf-token'] || req.headers['x-csrf-token'];
    return (Array.isArray(token) ? token[0] : token) || '';
  },
});

export function csrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 1. Skip CSRF for Webhooks and Auth Login (Stateless/Server-to-Server)
  if (req.path.includes('/webhooks') || req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
    return next();
  }

  // 2. Skip CSRF for Mobile/API Clients using Bearer JWTs
  // (CSRF is a browser-based cookie vulnerability)
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  // 3. Apply standard CSRF protection
  csrfProtection(req, res, (err: any) => {
    if (err) {
      return next(err);
    }

    // 4. Double Submit Cookie Pattern:
    // Send the token in a non-HttpOnly cookie so Axios/Fetch can read it
    // and attach it to the X-XSRF-TOKEN header on subsequent requests.
    if (req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken(), {
      domain: process.env.COOKIE_DOMAIN || undefined,
        path: '/',
        httpOnly: false, // Must be readable by client JS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    next();
  });
}
