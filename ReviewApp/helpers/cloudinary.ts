import { CLOUDINARY_CLOUD_NAME } from "@env";

type ImageSize = "thumbnail" | "medium" | "large" | "original";

export const transformCloudinaryImageSize = (
  publicId: string,
  size: ImageSize = "original"
): string => {
  if (!publicId) {
    return "";
  }

  let transformation = "";

  switch (size) {
    case "thumbnail":
      transformation = "w_150,h_150,c_fill,q_auto:good";
      break;
    case "medium":
      transformation = "w_600,q_auto:good";
      break;
    case "large":
      transformation = "w_1200,q_auto:best";
      break;
    case "original":
    default:
      transformation = "q_auto:best";
      break;
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}.jpg`;
};
