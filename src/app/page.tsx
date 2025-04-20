import Container from "~/components/Container";
import PostsList from "~/components/PostsList";
import { env } from "~/env";

export default function HomePage() {
  return (
    <main className="min-h-svh bg-black">
      <Container className="py-12 md:py-24 lg:max-w-6xl lg:py-32">
        <div className="mb-16 border-b border-gray-700 pb-8">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">
            {env.BLOG_TITLE}
          </h1>
        </div>

        <PostsList />
      </Container>
    </main>
  );
}
