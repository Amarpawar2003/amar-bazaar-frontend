export const uploadToCoudinary = async (pics: File) => {
  if (!pics) {
    throw new Error("No image selected");
  }

  const data = new FormData();

  data.append("file", pics);
  data.append("upload_preset", "amar_food");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/k1wxqqnx/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const fileData = await res.json();

    console.log("Cloudinary response:", fileData);

    if (!res.ok) {
      throw new Error(
        fileData?.error?.message || "Cloudinary upload failed"
      );
    }

    if (!fileData?.secure_url) {
      throw new Error("Cloudinary did not return image URL");
    }

    return fileData;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};