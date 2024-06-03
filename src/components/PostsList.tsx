import Link from "next/link";
import Image from "next/image";
import getStrapiUrl from "~/lib/getStrapiUrl";

async function getPosts() {
  const query = {
    fields: ["createdAt", "updatedAt"],
    populate: {
      metadata: {
        populate: {
          authors: {
            fields: ["image"],
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

  const url = getStrapiUrl({ path: "/blog-posts", query });

  return fetch(url, {
    cache: "no-store",
  }).then((res) => res.json() as Promise<StrapiResponse<Post[]>>);
}

export default async function PostsList() {
  const { data, error } = await getPosts();

  if (!data || error) {
    console.log(error);

    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-2xl font-bold tracking-tight text-white">
          There was an error
        </p>
        <p className="max-w-xs text-sm text-gray-400">
          Try refreshing the page, if the error persists, come back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-24">
      {data.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-2xl font-bold tracking-tight text-white">
            There are no posts yet
          </p>
          <p className="max-w-xs text-sm text-gray-400">Come back later.</p>
        </div>
      )}
      {data.map((post) => (
        <Post post={post} key={post.id.toString()} />
      ))}
    </div>
  );
}

function Post({ post }: { post: Post }) {
  const { metadata } = post.attributes;

  return (
    <Link className="block" href={`/posts/${post.id}`}>
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
    </Link>
  );
}
