# Mock PR Diff — For Demo Purposes

## PR #247: Add rate limiting to auth endpoints

### Files Changed (6)

---

**src/api/auth/login.ts** (+45, -12)

```diff
 import { rateLimit } from '@/middleware/rateLimit';
+import { AuditLog } from '@/services/audit';

 export async function loginHandler(req: Request) {
+  // NEW: Rate limiting
+  const limiter = rateLimit({
+    windowMs: 15 * 60 * 1000, // 15 minutes
+    max: 5, // 5 attempts per window
+    keyGenerator: (req) => req.ip,
+  });
+
+  await limiter(req);
+
   const { email, password } = req.body;

+  // NEW: Audit logging
+  await AuditLog.record({
+    action: 'LOGIN_ATTEMPT',
+    email,
+    ip: req.ip,
+    timestamp: new Date(),
+  });
```

---

**src/middleware/rateLimit.ts** (+87, -0) [NEW FILE]

```diff
+import { Redis } from '@/lib/redis';
+
+export interface RateLimitConfig {
+  windowMs: number;
+  max: number;
+  keyGenerator: (req: Request) => string;
+}
+
+export function rateLimit(config: RateLimitConfig) {
+  return async (req: Request) => {
+    const key = `ratelimit:${config.keyGenerator(req)}`;
+    const current = await Redis.incr(key);
+
+    if (current === 1) {
+      await Redis.expire(key, config.windowMs / 1000);
+    }
+
+    if (current > config.max) {
+      throw new RateLimitError('Too many requests');
+    }
+  };
+}
```

---

**src/services/audit.ts** (+34, -0) [NEW FILE]

```diff
+export class AuditLog {
+  static async record(entry: AuditEntry) {
+    // Writes to audit_logs table
+    await db.insert('audit_logs', entry);
+  }
+}
```

---

**package.json** (+2, -0)

```diff
   "dependencies": {
+    "ioredis": "^5.3.0",
     "zod": "^3.22.0",
```

---

**src/api/auth/password-reset.ts** (+12, -3)

```diff
+import { rateLimit } from '@/middleware/rateLimit';
+
 export async function passwordResetHandler(req: Request) {
+  // Rate limit: 3 attempts per hour
+  await rateLimit({ windowMs: 3600000, max: 3, keyGenerator: r => r.ip })(req);
```

---

**src/types/errors.ts** (+8, -0)

```diff
+export class RateLimitError extends Error {
+  constructor(message: string) {
+    super(message);
+    this.name = 'RateLimitError';
+  }
+}
```

---

## Summary

- **Total**: +188 additions, -15 deletions
- **New dependencies**: ioredis
- **New files**: 2 (rateLimit.ts, audit.ts)
- **Security-related**: Yes (auth, rate limiting)
