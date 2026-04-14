import { supabase } from './client';

export const storage = {
  async uploadFile(file: File, bucket: string = 'website-images'): Promise<string | null> {
    if (!supabase) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};
