import { env } from "~/env";

export async function GET() {
  return Response.redirect(env.NEXT_PUBLIC_ADMIN_URL, 301);
}
