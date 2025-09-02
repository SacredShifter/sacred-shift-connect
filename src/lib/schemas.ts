import { z } from 'zod';

export const AddChannelSchema = z.object({
  platform: z.enum(['youtube', 'facebook', 'tiktok', 'instagram', 'twitter', 'podcast']),
  urlOrHandle: z.string().min(3, "URL or handle must be at least 3 characters."),
  title: z.string().optional(),
});

export type AddChannelInput = z.infer<typeof AddChannelSchema>;
