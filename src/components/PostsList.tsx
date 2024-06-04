import Link from "next/link";
import Image from "next/image";
import getStrapiUrl from "~/lib/getStrapiUrl";
import { env } from "~/env";

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

    if (error?.name === "ForbiddenError") {
      return <ForbiddenError />;
    }

    return <ErrorMessage />;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-24">
      {data.length === 0 && (
        <div className="col-span-full flex flex-col items-center gap-2 py-12 text-center">
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
      {metadata.category && (
        <p className="text-sm capitalize text-gray-400">{metadata.category}</p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-white">
        {metadata.title}
      </h2>

      <div className="mt-4 flex items-center gap-2">
        {metadata.authors.data && (
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
        )}
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

function ForbiddenError() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <p className="text-lg tracking-tight text-gray-400">
        Thanks for using this template!
      </p>
      <p className="text-2xl font-bold tracking-tight text-white">
        You need to configure the permissions to see the posts
      </p>
      <div className="mt-12 max-w-2xl rounded-lg bg-gray-900 p-4 lg:p-6">
        <p className="mb-4 border-b border-gray-700 pb-4 text-lg font-medium tracking-tight text-gray-400">
          Steps to configure the permissions:
        </p>
        <ul>
          <li>
            <p className="text-start text-lg font-medium tracking-tight text-gray-400">
              Option 1:
            </p>
            <p className="mt-4 text-start text-white">
              See this 25s{" "}
              <Link
                className="underline"
                target="_blank"
                href="https://blog-railway-template.s3.us-east-1.amazonaws.com/configure_permissions_tutorial_de2bde73e2.mp4"
              >
                video tutorial
              </Link>{" "}
              to configure the permissions.
            </p>
          </li>
          <li>
            <p className="mt-4 border-t border-gray-700 pt-4 text-start text-lg font-medium tracking-tight text-gray-400">
              Option 2: follow the steps below
            </p>
            <ol className="mt-4 list-inside list-decimal space-y-4 text-start text-white">
              <li>
                Go to your{" "}
                <Link
                  href={`${env.NEXT_PUBLIC_ADMIN_URL}/admin`}
                  className="underline"
                  target="_blank"
                >
                  Strapi admin panel
                </Link>{" "}
                and navigate to the
                <span className="font-bold"> Settings</span> section, in the
                left sidebar.
              </li>
              <li>
                The <span className="font-bold"> Settings</span> sidebar will
                appear. In the{" "}
                <span className="font-bold"> USERS & PERMISSIONS PLUGIN</span>{" "}
                section, click on the <span className="font-bold"> Roles</span>{" "}
                tab.
              </li>
              <li>
                You will see a list with the{" "}
                <span className="font-bold">Authenticated</span> and{" "}
                <span className="font-bold">Public</span> roles. Click on the{" "}
                <span className="font-bold">Public</span> role.
              </li>
              <li>
                You will find a list of permissions. Open the{" "}
                <span className="font-bold"> Author</span> and{" "}
                <span className="font-bold"> Blog-post</span> dropdowns and
                check the <span className="font-bold"> find</span> and{" "}
                <span className="font-bold"> findOne</span> permissions in both
                of them.
              </li>
              <li>
                Click <span className="font-bold"> Save</span> in the top right
                corner.
              </li>
              <li>
                Refresh the page and you should be able to see the posts now.
              </li>
            </ol>
          </li>
        </ul>
        <p className="mt-4 border-t border-gray-700 pt-4 text-lg font-medium tracking-tight text-gray-400">
          If you have any trouble configuring the permissions, please contact me
          at <br />
          <Link href="mailto:bmariano.me@gmail.com" className="underline">
            bmariano.me@gmail.com
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function ErrorMessage() {
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
