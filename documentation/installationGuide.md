# **Thrifty Bites — Installation & Deployment Guide (Minimal Setup)**

## **Overview**
This guide walks you through the **minimum required steps** to deploy Thrifty Bites, assuming:

- The MongoDB database already exists and is populated  
- The repository is already configured  
- You only need to create service accounts, obtain API keys, add environment variables, and deploy to Vercel  

This is the fastest path to getting the app running in production.

---

# **1. Required Accounts**

You must create four accounts to obtain the necessary API keys:

- **Vercel** — hosting + CI/CD  
- **Cloudinary** — image hosting  
- **MongoDB Atlas** — database (already created, but you still need a connection string)  
- **Google Cloud Platform (GCP)** — Google Maps API  

Below are the minimal steps for each.

---

# **2. Cloudinary Setup (Image Hosting)**

Cloudinary stores all recipe and resource images.

### **Steps**
1. Create an account at: [https://cloudinary.com](https://cloudinary.com)  
2. Go to **Dashboard**  
3. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### **Environment Variables Needed**
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# **3. MongoDB Atlas Setup (Database Connection)**

The database already exists — you just need the connection string.

### **Steps**
1. Log into MongoDB Atlas: [https://cloud.mongodb.com](https://cloud.mongodb.com)  
2. Open the existing cluster  
3. Go to **Database → Connect → Drivers**  
4. Copy the connection string:

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/thriftybites
```

### **Environment Variable Needed**
```
MONGO_URI=
```

---

# **4. Google Cloud Platform Setup (Maps API)**

Used for the interactive map and advanced markers.

### **Steps**
1. Go to `https://console.cloud.google.com` [(console.cloud.google.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fconsole.cloud.google.com%2F")  
2. Create or select a project  
3. Enable:
   - **Maps JavaScript API**
4. Go to **APIs & Services → Credentials**  
5. Create an **API Key**  
6. Restrict it to:
   - HTTP referrers: `https://*.vercel.app/*`
   - API: Maps JavaScript API

### **Environment Variable Needed**
```
NEXT_PUBLIC_MAPS_API_KEY=
```

---

# **5. Vercel Setup (Hosting & Deployment)**

Vercel hosts the entire application and runs all serverless API routes.

---

## **5.1 Create a Vercel Account**
1. Go to [https://vercel.com](https://vercel.com)  
2. Sign in with GitHub  
3. Authorize access to your repositories  

---

## **5.2 Import the Repository**
1. Go to **Add New → Project**  
2. Select the Thrifty Bites repository  
3. the project is inside a subfolder, so set:

```
Project Settings → Root Directory → digitalcookbook
```

4. Vercel will auto-detect Next.js

---

## **5.3 Add Environment Variables**

Go to:

```
Vercel → Project → Settings → Environment Variables
```

Add the following:

```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SESSION_SECRET=anyrandomlongstringoflettersandnumbers
NEXT_PUBLIC_MAPS_API_KEY=
```

Add these to:**Production**

---

## **5.4 Deploy the App**

Click **Deploy**.

Vercel will:

- Install dependencies  
- Build the Next.js app  
- Deploy serverless API routes  
- Provide a production URL  

---

# **6. Post‑Deployment Verification**

After deployment, verify:

### **✔ API routes work**
Visit:

```
/api/locations
/api/recipes
```

### **✔ Images load**
Cloudinary URLs should resolve.

### **✔ Map loads**
If not:
- Check `NEXT_PUBLIC_MAPS_API_KEY`
- Check referrer restrictions

### **✔ Admin panel works**
Test:
- Login  
- Uploading images  
- Editing content  

---
