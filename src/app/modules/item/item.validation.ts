import { z } from 'zod';

export const createItemSchema = z.object({
  // Basic info
  name: z.string().min(1, { message: 'Name is required' }),

  // Numeric identifiers
  niin: z.number().min(1, { message: 'NIIN is required' }),
  model: z.number().min(1, { message: 'Model is required' }),
  lin: z.number().min(1, { message: 'LIN is required' }),
  nsn: z.number().min(1, { message: 'NSN is required' }),
  manul: z.number().min(1, { message: 'Manual is required' }),

  // String identifiers
  elc: z.string().min(1, { message: 'ELC is required' }),
});

export const updateItemSchema = z.object({
  // Basic info
  name: z.string().optional(),

  // Numeric identifiers
  niin: z.number().optional(),
  model: z.number().optional(),
  lin: z.number().optional(),
  nsn: z.number().optional(),
  manul: z.number().optional(),

  // String identifiers
  elc: z.string().optional(),
});
