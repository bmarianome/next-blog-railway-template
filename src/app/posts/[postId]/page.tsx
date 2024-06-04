import RichTextRenderer from "~/components/RichTextRender";
import Container from "~/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import getStrapiUrl from "~/lib/getStrapiUrl";

async function getBlog(id: string) {
  const query = {
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
  };

  const url = getStrapiUrl({ path: `/blog-posts/${id}`, query });

  return await fetch(url, {
    cache: "no-store",
  }).then((res) => res.json() as Promise<StrapiResponse<Post>>);
}

export async function generateMetadata({
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

  return {
    title: data.attributes.metadata.title,
    description: data.attributes.metadata.description,
  };
}

export default async function PostPage({
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
        {/* BACK BTTON */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to posts
        </Link>

        <div className="mb-8 mt-12 border-b border-gray-700 pb-4">
          <div className="flex flex-col">
            <p className="text-sm capitalize text-gray-400">
              {metadata.category}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {metadata.title}
            </h2>

            {metadata.authors.data && (
              <div className="mt-4 flex items-center gap-3">
                {metadata.authors.data.map((author) => (
                  <div className="flex items-center" key={author.id.toString()}>
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-black bg-gray-500">
                      <Image
                        fill
                        src={author.attributes.image.data.attributes.url}
                        alt={author.attributes.name}
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm text-white">
                        {author.attributes.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <span className="inline-block mt-4 text-base text-gray-400">
              {new Date(data.attributes.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </span>
          </div>
        </div>
        <RichTextRenderer blocks={data.attributes.post} />
      </Container>
    </div>
  );
}
