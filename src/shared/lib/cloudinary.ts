import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** No tira si falla: borrar la imagen de la base ya vale, aunque quede basura facturable en Cloudinary por revisar a mano. */
export async function destroyCloudinaryImage(imageId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.error(`No se pudo borrar la imagen ${imageId} de Cloudinary`, error);
  }
}
