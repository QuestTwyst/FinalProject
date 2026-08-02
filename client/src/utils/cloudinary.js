const CLOUD_NAME = "a9s5uskh";
const UPLOAD_PRESET = "QuestTwyst_uploads";

/**
 * Uploads an image file directly from the browser to Cloudinary
 * (unsigned upload -- no backend secret needed). Returns the
 * permanent CDN URL for the uploaded image.
 */
export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.error?.message || "Failed to upload image to Cloudinary",
    );
  }

  const data = await response.json();
  return data.secure_url;
}
