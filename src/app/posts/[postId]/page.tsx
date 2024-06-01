import Image from "next/image";
import { notFound } from "next/navigation";
import qs from "qs";
import Container from "~/components/Container";
import RichTextRenderer from "~/components/RichTextRender";

const query = qs.stringify({
  populate: {
    metadata: {
      populate: {
        authors: {
          populate: {
            image: {
              fields: ["url"],
            },
          },
        },
      },
    },
  },
});

async function getBlog(id: string) {
  return await fetch(
    `http://localhost:1337/api/blog-posts/${id}?${query}`,
  ).then((res) => res.json() as Promise<BackendResponse<Post>>);
}

export default async function SuspenseWrapper({
  params,
}: {
  params: { postId: string };
}) {
  const id = params.postId.split("-").shift();

  if (!id) return notFound();

  const { data, error } = await getBlog(id);

  if (!data || error) {
    return notFound();
  }

  const { metadata } = data.attributes;

  return (
    <div className="min-h-svh bg-black">
      <Container className="py-12 md:py-24 lg:max-w-6xl lg:py-32">
        <p className="text-sm capitalize text-gray-400">{metadata.category}</p>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {metadata.title}
        </h2>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            {metadata.authors.data.map((author) => (
              <div
                key={author.id.toString()}
                className="relative h-7 w-7 overflow-hidden rounded-full border border-black bg-gray-500"
              >
                <Image
                  fill
                  src={author.attributes.image.data.attributes.url}
                  alt={author.attributes.name}
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
          <span className="text-base text-gray-400">
            {new Date(post.attributes.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <RichTextRenderer blocks={data.attributes.post} />
      </Container>
    </div>
  );
}
