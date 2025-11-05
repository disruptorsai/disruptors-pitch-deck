/**
 * Storage Service - Supabase Storage Integration
 *
 * Handles all file uploads and management via Supabase Storage
 * Files are organized by client: {client_id}/{entity_type}/{filename}
 */

import { supabaseAdmin } from './supabase-client';
import type { UploadOptions, UploadResult } from './types';

const STORAGE_BUCKET = 'ai-presenter-files';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

class StorageService {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    clientId: string,
    file: File,
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // Generate storage path
    const timestamp = Date.now();
    const sanitizedFilename = this.sanitizeFilename(file.name);
    const entityType = options?.entityType || 'general';
    const storagePath = `${clientId}/${entityType}/${timestamp}-${sanitizedFilename}`;

    try {
      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

      // Return upload result
      return {
        id: '', // Will be set by database insert
        client_id: clientId,
        filename: file.name,
        storage_path: storagePath,
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        file_type: options?.fileType || this.inferFileType(file.type),
        entity_type: options?.entityType,
        entity_id: options?.entityId,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to upload file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    clientId: string,
    files: File[],
    options?: UploadOptions
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(clientId, file, options)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to upload files: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(storagePath: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .remove([storagePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to delete file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(storagePaths: string[]): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .remove(storagePaths);

      if (error) throw error;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to delete files: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(
    storagePath: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(storagePath, expiresIn);

      if (error) throw error;

      return data.signedUrl;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to generate signed URL: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get signed URLs for multiple files
   */
  async getSignedUrls(
    storagePaths: string[],
    expiresIn: number = 3600
  ): Promise<string[]> {
    try {
      const urlPromises = storagePaths.map((path) =>
        this.getSignedUrl(path, expiresIn)
      );

      return await Promise.all(urlPromises);
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to generate signed URLs: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(
    path: string,
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: 'name' | 'created_at' | 'updated_at';
    }
  ): Promise<
    Array<{
      name: string;
      id: string;
      updated_at: string;
      created_at: string;
      last_accessed_at: string;
      metadata: any;
    }>
  > {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .list(path, {
          limit: options?.limit || 100,
          offset: options?.offset || 0,
          sortBy: {
            column: options?.sortBy || 'created_at',
            order: 'desc',
          },
        });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to list files: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Move/rename a file
   */
  async moveFile(fromPath: string, toPath: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .move(fromPath, toPath);

      if (error) throw error;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to move file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Copy a file
   */
  async copyFile(fromPath: string, toPath: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .copy(fromPath, toPath);

      if (error) throw error;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to copy file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get storage bucket info
   */
  async getBucketInfo(): Promise<{
    id: string;
    name: string;
    public: boolean;
    file_size_limit: number;
    allowed_mime_types: string[];
  }> {
    try {
      const { data, error } = await supabaseAdmin.storage.getBucket(
        STORAGE_BUCKET
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to get bucket info: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Delete all files for a client
   */
  async deleteClientFiles(clientId: string): Promise<void> {
    try {
      // List all files for the client
      const { data: files, error: listError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .list(clientId, {
          limit: 1000,
        });

      if (listError) throw listError;

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${clientId}/${file.name}`);
        await this.deleteFiles(filePaths);
      }
    } catch (error) {
      console.error('Storage Service Error:', error);
      throw new Error(
        `Failed to delete client files: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Sanitize filename for storage
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9.-]/gi, '_')
      .toLowerCase()
      .replace(/_{2,}/g, '_');
  }

  /**
   * Infer file type from MIME type
   */
  private inferFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    if (
      mimeType.includes('word') ||
      mimeType.includes('document') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      return 'document';
    if (
      mimeType.includes('sheet') ||
      mimeType.includes('excel') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
      return 'spreadsheet';
    if (
      mimeType.includes('presentation') ||
      mimeType.includes('powerpoint') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
      return 'presentation';

    return 'other';
  }

  /**
   * Validate file type
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    const fileType = this.inferFileType(file.type);
    return allowedTypes.includes(fileType);
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  /**
   * Check if storage is configured
   */
  isConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  }
}

export const storageService = new StorageService();
