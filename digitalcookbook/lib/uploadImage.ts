// upload, edit, or delete image to cloudinary
export async function uploadImage(file?: File, publicID?: string): Promise<string | boolean | null> {
    try {
        
        if (file && publicID) { // edit image
            // prepare file
            const formData = new FormData();
            formData.append("file", file);
            formData.append("public_id", publicID);

            // edit image
            return fetch("/api/upload-images", {
                method: "PUT",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.success)
                    return data.url; // if success, return url of image
                else {
                    console.error("Edit failed: ", data); // else, error
                    return null;
                }
            });

        } else if (file) { // create new image
            // prepare file
            const formData = new FormData();
            formData.append("file", file);

            // upload file
            return fetch("/api/upload-images", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.success)
                    return data.url; // if success, return url of image
                else {
                    console.error("Upload failed: ", data); // else, error
                    return null;
                }
            });

        } else if (publicID) { // delete image
            // prepare file
            const formData = new FormData();
            formData.append("public_id", publicID);

            // delete image
            return fetch("/api/upload-images", {
                method: "DELETE",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.success)
                    return true; // if success, return true
                else {
                    console.error("Delete failed: ", data); // else, error
                    return null;
                }
            });

        } else {
            console.error("Error, Must provide atleast a publicID or file");
            return null;
        }

    } catch (error) {
        console.error("Upload error: ", error); // catch errors
        return null;
    }
};