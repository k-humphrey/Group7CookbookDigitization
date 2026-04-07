// upload image to cloudinary
export async function uploadImage(file: File): Promise<string | null> {
    try {
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

    } catch (error) {
        console.error("Upload error: ", error); // catch errors
        return null;
    }
};