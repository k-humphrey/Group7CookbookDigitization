//app/api/upload-images.ts
//This is a route that will handle image upload and updates with cloudinary
import { NextResponse } from "next/server"
import { cloudinary} from "@/lib/cloudinary"
import type { UploadApiResponse } from "cloudinary"
import { isAdminAuthenticated } from "@/lib/checkAdminAuth"
import { cookies } from "next/headers"

/*Upload new Image
Expected Parameter: formData object (the image to be uploaded)
Expected Return: success (includes url and public_id fields), or failure 
What to do with this? get an image as formData, and fetch a POST to this route with the formData as the body
Then, when you get the return, save the url and the public_id to the database. :)
*/
export async function POST(req: Request){
    const cookieStore = await cookies();

    //check authentication
    if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    //try to get the image
    try {
        const formData = await req.formData()
        const file = formData.get("file")
        
        //check if the file object is real
        if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }
        //we have to convert to an array buffer, then to a buffer because thats what cloudinary accepts
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //then upload to cloudinary (straight from cloudinary docs)
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error)
            resolve(result as UploadApiResponse)
        }).end(buffer); // your image buffer
        })

        //return url (at this point it's assumed successful)
        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url, 
            public_id: uploadResult.public_id, //apparently we need this for every image :(
        })

    } catch(err){ //if upload fails!
        console.error("Cloudinary upload error:", err)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

/*Update existing image
Expected Parameter: file and public_id as formdata
Expected Return error or new url and new public id, these must also be saved in db by caller; */
export async function PUT(req: Request){
    const cookieStore = await cookies()

    //check authentication
    if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //get image and public id
    const formData = await req.formData()
    const file = formData.get("file")
    const raw = formData.get("public_id")

    // validate
    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    if (!raw || typeof raw !== "string") {
        return NextResponse.json({ error: "Missing public_id" }, { status: 400 })
    }
    const public_id = raw; //just because we checked type for typescript 

    //delete existing image
    await cloudinary.uploader.destroy(public_id, async (error) =>{
        if(error){
                return NextResponse.json({ error: "Delete failed" }, { status: 500 })
        }
    })
   
    //upload new image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error)
            resolve(result as UploadApiResponse)
        }).end(buffer)
    })

    //return url (at this point it's assumed successful)
    return NextResponse.json({
        success: true,
        url: uploadResult.secure_url, 
        public_id: uploadResult.public_id, 
    })
}
