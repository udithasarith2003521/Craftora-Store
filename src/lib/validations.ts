import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long'),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).default([]),
  version: z.string().max(50).optional().nullable(),
  fileUrl: z.string().url('A valid file URL is required'),
  fileName: z.string().min(1, 'File name is required').max(255),
  fileSize: z.number().int().positive('File size must be positive'),
  fileType: z.string().min(1, 'File type is required'),
  coverImageUrl: z.string().url('A valid cover image URL is required'),
  images: z.array(z.string().url()).optional().default([]),
  status: z.enum(['published', 'draft']).default('published'),
});

export type ProductInput = z.infer<typeof productSchema>;
