# **Cloudinary Integration Documentation**

## **Overview**
Thrifty Bites uses **Cloudinary** as its image hosting, optimization, and CDN delivery platform.  
Cloudinary handles:

- Uploading recipe images from the admin panel  
- Storing and optimizing images  
- Delivering fast, cached, responsive URLs  
- Managing deletions and updates  
- Generating secure URLs for production environments  

---

## **1. Cloudinary Setup**

### **Environment Variables**
Cloudinary requires the following environment variables in `.env.local`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

These must also be configured in your deployment environment (Vercel → Project Settings → Environment Variables).

---

## **2. Cloudinary Client Configuration**

### **Server-Side (Node / Next.js API Routes)**

```ts
import { cloudinary} from "@/lib/cloudinary"
```
After that, use cloudinary API to interact with it.


---

## **3. Uploading Images**

### **Admin Panel → API Route Upload**

Images are uploaded using Cloudinary’s `upload` or `upload_stream` method.

#### **Example: Uploading a File Buffer**

```ts
const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({resource_type:"image"},(error, result) => {
            if (error) return reject(error)
            resolve(result as UploadApiResponse)
        }).end(buffer);
```

#### **Example Response (important fields)**

```json
{
  "success": true,
  "public_id": "thrifty-bites/recipes/abc123",
  "url": "https://res.cloudinary.com/.../image/upload/v123456/abc123.jpg",
}
```

### **What You Must Store in the Database**
Store:

- `public_id` → required for deletion or updating  
- `secure_url` → used for displaying images  

---

## **4. Deleting Images**

To delete an image, you must have the `public_id`.

```ts
const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
      invalidate: true
    });
```
---

## **5. Updating / Replacing Images**

To replace an image:

```ts
const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id,       // overwrite this exact asset
          overwrite: true, // allow overwrite
          invalidate: true // purge CDN cache so new image shows immediately
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }
      ).end(buffer);
    });
```


---

## **6. Using Cloudinary URLs in the Frontend**

### **Basic Usage**
```tsx
<Image
                    src={recipe.imageURI.trimEnd()}
                    alt={recipe.title?.[lang] ?? "Recipe image"}
                    fill
                    className="object-cover"
/>
```


## **7. Security Considerations**

- Uploads must occur **server-side** unless using unsigned presets  
- Never expose `API_SECRET` in frontend code  
- Always use `secure_url`  
---
