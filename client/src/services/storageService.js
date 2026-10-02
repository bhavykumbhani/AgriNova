import { supabase } from '../lib/supabase';

/**
 * Service to handle image uploads to Supabase Storage
 */
export const storageService = {
  /**
   * Upload a product image to 'product-images' bucket
   * Path: products/{farmerAuthId}/{timestamp}_{safeFilename}
   */
  uploadProductImage: async (file, farmerAuthId) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    if (!file) {
      throw new Error('No file provided');
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size exceeds 5MB limit.');
    }

    const fileExt = file.name.split('.').pop() || 'webp';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `products/${farmerAuthId}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error('Failed to upload image: ' + error.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return {
      storage_path: data.path,
      image_url: publicUrl,
    };
  },
};
