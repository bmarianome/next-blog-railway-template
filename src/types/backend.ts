declare global {
  interface BackendResponse<T> {
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

  interface Post {
    id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      metadata: PostMetadata;
      post: RichTextBlock[];
    };
  }

  interface PostMetadata {
    id: number;
    title: string;
    description: string;
    category: Category;
    authors: {
      data: Author[]
    }
  }

  interface Author {  
    id: number;
    attributes: {
      name: string;
      role: string;
      image: {
        data: StrapiFile;
      }
    }
  }

  interface StrapiFile {
    id: number;
    attributes: {
      url: string;
    };
  }

  type Category = "Technology" | "Design" | "Business";
}
