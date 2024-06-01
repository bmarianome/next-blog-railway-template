declare global {
  interface Child {
    text: string;
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
  }

  interface TextChild extends Child {
    type: "text";
  }

  interface LinkChild extends Child {
    type: "link";
    url: string;
    children: TextChild[];
  }

  type ListItemChild = TextChild | LinkChild;

  interface ListItem {
    type: "list-item";
    level?: number;
    children: ListItemChild[];
  }

  interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: null;
    size: number;
    width: number;
    height: number;
  }

  interface Image {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    size: number;
    width: number;
    height: number;
    caption: null;
    formats: {
      small: ImageFormat;
      thumbnail: ImageFormat;
    };
    provider: string;
    createdAt: string;
    updatedAt: string;
    previewUrl: null;
    alternativeText: string;
    provider_metadata: null;
  }

  interface ImageBlock {
    type: "image";
    image: Image;
    children: TextChild[];
  }

  interface Paragraph {
    type: "paragraph";
    children: (TextChild | LinkChild)[];
  }

  interface Heading {
    type: "heading";
    level: number;
    children: TextChild[];
  }

  interface List {
    type: "list";
    format: "ordered" | "unordered";
    children: ListItem[];
  }

  interface Quote {
    type: "quote";
    children: (TextChild | LinkChild)[];
  }

  type RichTextBlock = Paragraph | Heading | List | ImageBlock | Quote;
}
