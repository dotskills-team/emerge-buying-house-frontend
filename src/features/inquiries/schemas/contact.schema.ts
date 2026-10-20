import { z } from 'zod';
import { INQUIRY_TOPICS } from '@/types/inquiry';

// Mirrors the backend rules (modules/inquiries/validators/inquiry.validator.ts) so visitors see
// problems before sending. The backend still validates everything.
const oneLine = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .refine((v) => !/[\r\n]/.test(v), `${label} must be on one line.`);

export const MESSAGE_MAX = 5000;

export const contactSchema = z.object({
  name: oneLine(100, 'Name').pipe(z.string().min(2, 'Enter your name.')),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .max(254)
    .pipe(z.email('Enter a valid email address.')),
  company: oneLine(120, 'Company'),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine(
      (v) => v === '' || /^\+?[\d\s().-]{6,40}$/.test(v),
      'Enter a valid phone number, e.g. +880 1700 000000.',
    ),
  country: oneLine(80, 'Country'),
  topic: z.enum(INQUIRY_TOPICS, 'Choose what your message is about.'),
  product: oneLine(140, 'Product'),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more (at least 10 characters).')
    .max(MESSAGE_MAX, `Keep the message under ${MESSAGE_MAX.toLocaleString()} characters.`),
  website: z.string(),
});

export type ContactValues = z.infer<typeof contactSchema>;
