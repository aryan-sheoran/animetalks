/**
 * Utility function to properly handle image URLs from the backend
 * Handles both full Cloudinary URLs and local asset filenames
 */
export const getImageSrc = (imageData) => {
  // Handle different possible image field names
  const img = imageData?.cardImage || imageData?.imageUrl || imageData?.coverImageUrl;
  
  if (!img) {
    // Fallback: generate filename from title if no image is provided
    if (imageData?.title || imageData?.name) {
      const fileName = (imageData.title || imageData.name || 'unknown')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      return `/assets/card-images/${fileName}.jpeg`;
    }
    return '';
  }

  // If backend returned a full URL (http/https) or absolute path, use as-is
  if (/^https?:\/\//i.test(img) || img.startsWith('/')) return img;

  // Otherwise assume filename in public assets
  return `/assets/card-images/${img}`;
};