type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  quality?: number | 'auto' | 'auto:low' | 'auto:good' | 'auto:eco';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
};

export function getTransformedCloudinaryUrl(
  originalUrl: string,
  options: CloudinaryTransformOptions = {}
): string {
  const { width, height, quality = 'auto:low', crop = 'fill' } = options;

  if (!originalUrl.includes('/upload/')) {
    console.warn('Invalid Cloudinary URL');
    return originalUrl;
  }

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);

  const transformationString = transformations.join(',');

  return originalUrl.replace('/upload/', `/upload/${transformationString}/`);
}
