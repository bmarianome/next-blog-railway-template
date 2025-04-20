import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    API_URL: z.string().min(1),
    AWS_BUCKET_HOSTNAME: z.string().min(1),
    FAVICON_URL: z.string().url().optional(),
    BLOG_TITLE: z.string().min(1),
    BLOG_DESCRIPTION: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_ADMIN_URL: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.API_URL,
    AWS_BUCKET_HOSTNAME: process.env.AWS_BUCKET_HOSTNAME,
    FAVICON_URL: process.env.FAVICON_URL,
    BLOG_TITLE: process.env.BLOG_TITLE,
    BLOG_DESCRIPTION: process.env.BLOG_DESCRIPTION,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
