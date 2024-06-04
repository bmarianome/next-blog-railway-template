declare global {
  interface StrapiResponse<T> {
    data: T | null;
    error:
      | {
          status: number;
          name: string;
          message: string;
          details: object;
        }
      | undefined;
  }

  interface StrapiObject<T> {
    id: number;
    attributes: T;
  }

  type Post = StrapiObject<{
    createdAt: string;
    updatedAt: string;
    metadata: PostMetadata;
    post: RichTextBlock[];
  }>;

  interface PostMetadata {
    title: string;
    description: string;
    category?: string;
    authors: {
      data: Author[] | null;
    };
  }

  type Author = StrapiObject<{
    name: string;
    role: string;
    image: {
      data: StrapiFile;
    };
  }>

  type StrapiFile = StrapiObject<{
    url: string;
  }>;
}
