import axios from "axios";

class ImageUploadManager {
    constructor() {
      if (ImageUploadManager.instance) {
        return ImageUploadManager.instance; // Return the singleton instance
      }
  
      ImageUploadManager.instance = this;
    }
  
    async uploadImage(image) {
      try {
        const { url, imageName } = await this.getSignedUrl();
        
        await this.uploadImageToS3(url, image);
  
        const imageUrl = `https://corportal.s3.ap-south-1.amazonaws.com/upload/profilePic/${imageName}`;
        return imageUrl;
  
      } catch (error) {
        console.error("Error in image upload process", error);
        alert("Error uploading file");
      }
    }
  
    async getSignedUrl() {
      try {
        const res = await axios.get(`${API_URL}/uploadImage`);
        if (res.status === 200) {
          return res.data.data;
        } else {
          throw new Error("Failed to get signed URL");
        }
      } catch (error) {
        console.error("Error getting signed URL", error);
        throw error;
      }
    }
  
    async uploadImageToS3(url, image) {
      try {
        const res = await axios.put(url, image, {
          headers: {
            "Content-Type": image.type, 
            Authorization: undefined,  
          },
        });
        if (res.status === 200) {
          return true;
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image to S3", error.response || error);
        throw error;
      }
    }
  }
  
  // Singleton Instance
  const imageUploadManager = new ImageUploadManager();
  
  // Example Usage:
  const image = /* Your image file */
  imageUploadManager.uploadImage(image);
  
