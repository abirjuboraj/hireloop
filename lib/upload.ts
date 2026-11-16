'use server'

export const uploadProfileImage = async(file: File)=> {
    try {
        const apiKey = process.env.IMGBB_API_KEY;

        if(!apiKey){
            throw new Error("ImgBB API key is missing");
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`,{
            method: "POST",
            body: formData,
        });

        const result = await res.json();

        console.log(result);

        if(!res.ok || !result.success){
            throw new Error("Image upload failed");
        }

        return {
            success: true,
            url: result.data.url,
        };
    } catch (error) {

        console.error("ImgBB upload error:", error);

        return{
            success: false,
            url: null,
            message: error instanceof Error ? error.message : "Image upload failed",
        }
    }
}