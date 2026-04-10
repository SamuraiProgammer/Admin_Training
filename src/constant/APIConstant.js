export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
 export const secret_Key="TkxuY0xzQnBpc0FXSTRMM2xzdjFua1dDOFp5NVZzVWkwWTJwLVJwT280WTo="
 export function getFileNameFromUrl(url) {
  const parts = url.split("/");
  const fileNameWithExtension = parts[parts.length - 1];

  // Remove the file extension if you only need the name
  const fileName = fileNameWithExtension.split(".")[0];
  
  return fileName;
}
export const API_URI = "https://practice.sageturtle.in/corporate/";
export const getLoggedInUserDetails = () => {
  const storedData = localStorage.getItem("persist:root");
  if (storedData) {
    const parsedData = JSON.parse(storedData);

    if (parsedData.userDetails) {
      const userDetails = JSON.parse(parsedData.userDetails);

      const currentUser = userDetails.currentUser;
      return currentUser;
    } else {
      console.error("userDetails not found in the stored data.");
    }
  } else {
    console.error("No data found in localStorage for the key 'persist:root'.");
  }
};
export const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const handleDownloadFilec = async(assetUrl) => {
  try {
    console.log(assetUrl,"image url");
    
      const response = await fetch(assetUrl);
      const blob = await response.blob();
      console.log(blob.type);
      console.log(blob.type === "application/pdf");
      
      return blob.type;
      
  } catch (error) {
      console.error('Error downloading the image:', error);
  }
};

export const getUniversityname={
  "6776287ec8d0d16564dcba7d": "Amity University",
  "6776615d7b6cc38356bc6ad1": "O.P Jindal University",
  "6776616d7b6cc38356bc6ad2": "Christ University",
  "677661a47b6cc38356bc6ad3": "Graphic Era University",
  "677661be7b6cc38356bc6ad4": "IGNOU University",
  "677b82e1175f0a1c1044625b": "Gautam Buddh University",
  "677b83cd175f0a1c1044625e": "Jamia Millia Islamia",
  "677b8417175f0a1c10446260": "Osmania University",
  "677b8479175f0a1c10446261": "Uttaranchal University",
  "677b868b175f0a1c10446271": "Delhi University",
  "677b8958175f0a1c1044628f": "Chaudhary Charan Singh University",
  "677b8cc5175f0a1c1044629b": "Punjab University",
  "677b8d22175f0a1c1044629c": "St. Albert's College",
  "677b8d5b175f0a1c1044629d": "Sharda University",
  "677b8db1175f0a1c1044629e": "Assam Down Town University",
  "677b8e34175f0a1c104462a0": "CMR University",
  "677b8e63175f0a1c104462a4": "Rama University",
  "677b8ed7175f0a1c104462a8": "Indian Institute of Psychology & Research",
  "677b9091175f0a1c104462b6": "Beaconhouse International College"
}
