// a cloud service like aws for image/video uploads
import { v2 as cloudinary } from 'cloudinary'
// fs - file system for file handling , comes with node no need to install
import fs from 'fs'

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null ;
        const response =  await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        })
        fs.unlinkSync(localFilePath);
        return response ;
    }catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error(error);

        return null;
    }
}

export {uploadCloudinary}