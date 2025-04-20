import RichTextRenderer from "~/components/RichTextRender";
import Container from "~/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import getStrapiUrl from "~/lib/getStrapiUrl";

async function getBlog(props: { params: { postId: string } }) {
  const { postId } = props.params;

  const id = postId.split("-").shift();

  if (!id) return notFound();

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

  const { data, error } = await fetch(url, {
    cache: "no-store",
  }).then((res) => res.json() as Promise<StrapiResponse<Post>>);

  if (!data || error) notFound();

  return data;
}

export async function generateMetadata(props: { params: { postId: string } }) {
  const post = await getBlog(props);

  return {
    title: post.attributes.metadata.title,
    description: post.attributes.metadata.description,
  };
}

export default async function PostPage(props: { params: { postId: string } }) {
  const post = await getBlog(props);

  return (
    <div className="min-h-svh bg-black">
      <Container className="py-12 md:py-24 lg:max-w-6xl lg:py-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to posts
        </Link>

        <PostHeader post={post} />
        <RichTextRenderer post={post} />
      </Container>
    </div>
  );
}

function PostHeader({ post }: { post: Post }) {
  const { metadata } = post.attributes;

  return (
    <div className="mb-8 mt-12 border-b border-gray-700 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {metadata.category && (
            <p className="text-sm capitalize text-gray-400">
              {metadata.category}
            </p>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {metadata.title}
          </h2>
          <p className="mt-4 text-sm text-gray-400">{metadata.description}</p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
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

          <span className="inline-block text-base text-gray-400">
            {new Date(post.attributes.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
