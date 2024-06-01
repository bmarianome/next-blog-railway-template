import Container from "~/components/Container";
import PostsList from "~/components/PostsList";

export default function HomePage() {
  return (
    <div className="min-h-svh bg-black">
      <Container className="py-12 md:py-24 lg:py-32 lg:max-w-6xl">
        <h2 className="text-3xl font-bold text-white sm:text-5xl">
          All posts
        </h2>
        <PostsList />
      </Container>
    </div>
  );
}
