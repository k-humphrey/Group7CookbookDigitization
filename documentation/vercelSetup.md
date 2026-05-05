# **Vercel Deployment Documentation — Thrifty Bites**

## **Overview**
Thrifty Bites is deployed on **Vercel**, which provides hosting, serverless API execution, environment variable management, and automatic CI/CD from GitHub.  
This document explains how the project is structured for deployment, how Vercel builds the app, and how environment variables, routing, and serverless functions are handled.

---

# **1. Deployment Architecture**

### **Framework**
- **Next.js App Router**
- **Serverless API routes** under `/app/api/...`
- **Client and server components** mixed throughout the app
- **Static assets** served from `/public`

### **Hosting Platform**
- **Vercel** (Production + Preview deployments)
- GitHub repository connected to Vercel

### **Deployment Flow**
1. Push to `main` → triggers **Production Deployment**
2. Push to any other branch → triggers **Preview Deployment**
3. Vercel runs:
   - `npm install`
   - `npm run build`
4. If the build succeeds, Vercel deploys:
   - Static assets
   - Serverless functions for API routes

---

# **2. Environment Variables**

Vercel securely stores all environment variables needed for the Nextjs app.

### **Important Notes**
- Variables must be added to **Development** environments.
- Vercel **does not read `.env.local`** during deployment.
- After updating variables, you must **redeploy**.

# **3. Build Settings**

### **Default Build Command**
```
npm run build
```

### **Output**
- `.next/` build folder
- Serverless functions for API routes
- Static HTML for static routes

---