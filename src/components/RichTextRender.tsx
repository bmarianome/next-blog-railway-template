import Image from "next/image";
import Link from "next/link";
import React from "react";

// Function to get CSS classes based on text styles
function getTextStyleClasses({
  bold,
  italic,
  underline,
  strikethrough,
}: {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}) {
  return [
    bold && "font-bold",
    italic && "italic",
    underline && "underline",
    strikethrough && "line-through",
  ]
    .filter(Boolean)
    .join(" ");
}

// Type guard to identify link children
function isLinkChild(child: TextChild | LinkChild): child is LinkChild {
  return "type" in child && child.type === "link";
}

// Function to render child elements based on their type
function renderChild(child: TextChild | LinkChild, childIndex: number) {
  return isLinkChild(child) ? (
    <Link
      href={child.url}
      key={childIndex}
      className={`text-brand-red underline ${getTextStyleClasses(child)}`}
    >
      {child.children[0]?.text}
    </Link>
  ) : (
    <span key={childIndex} className={getTextStyleClasses(child)}>
      {child.text}
    </span>
  );
}

// Generalized function to render blocks
function renderBlock(
  block: RichTextBlock,
  index: number,
  childrenRenderer: (children: (TextChild | LinkChild)[]) => React.ReactNode,
) {
  if (
    !Array.isArray(block.children) ||
    !block.children.every(
      (child) =>
        "type" in child && (child.type === "text" || child.type === "link"),
    )
  ) {
    return null;
  }

  return (
    <div key={index} className="flex flex-col gap-4">
      {childrenRenderer(block.children as (TextChild | LinkChild)[])}
    </div>
  );
}

// Function to render heading blocks
function renderHeading(block: Heading, index: number) {
  const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
  const fontSizeClass = [
    "text-5xl",
    "text-4xl",
    "text-3xl",
    "text-2xl",
    "text-xl",
    "text-lg",
  ][block.level - 1];

  return (
    <HeadingTag key={index} className={`${fontSizeClass} text-white`}>
      {block.children.map((child, childIndex) =>
        renderChild(child, childIndex),
      )}
    </HeadingTag>
  );
}

// Function to render list blocks
function renderList(block: List, index: number) {
  const ListTag = block.format === "ordered" ? "ol" : "ul";
  const listStyleClass =
    block.format === "ordered" ? "list-decimal" : "list-disc";

  return (
    <ListTag
      key={index}
      className={`${listStyleClass} list-inside text-base text-white`}
    >
      {block.children.map((listItem, listItemIndex) => (
        <li key={listItemIndex} className="mb-1">
          {listItem.children.map((child, childIndex) =>
            renderChild(child, childIndex),
          )}
        </li>
      ))}
    </ListTag>
  );
}

// Function to render quote blocks
function renderQuote(block: Quote, index: number) {
  return (
    <blockquote
      key={index}
      className="bg-gradient-horizontal w-max rounded-md bg-gray-900 p-4 text-base text-white"
    >
      <div className="border-l-4 border-white pl-4">
        {block.children.map((child, childIndex) =>
          renderChild(child, childIndex),
        )}
      </div>
    </blockquote>
  );
}

// Function to render image blocks
function renderImage(block: ImageBlock, index: number) {
  return (
    <div key={index} className="max-w-4xl overflow-hidden rounded-2xl p-1">
      <div className="relative h-full w-full">
        <Image
          width={block.image.width}
          height={block.image.height}
          src={block.image.url}
          alt={block.image.alternativeText || ""}
          className="rounded-xl object-cover object-center"
        />
      </div>
    </div>
  );
}

// Function to render code blocks
function renderCode(block: CodeBlock, index: number) {
  const codeContent = block.children[0]?.text;

  if (!codeContent) return null;

  return (
    <pre
      key={index}
      className="overflow-x-auto rounded-md bg-gray-900 p-4 text-base text-white"
    >
      <code className="language-ts">{codeContent}</code>
    </pre>
  );
}

// Main component to render rich text blocks
export default function RichTextRenderer({ post }: { post: Post }) {
  const { post: blocks } = post.attributes;

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return renderBlock(block, index, (children) => (
              <p className="text-base text-white">
                {children.map(renderChild)}
              </p>
            ));
          case "heading":
            return renderHeading(block, index);
          case "list":
            return renderList(block, index);
          case "quote":
            return renderQuote(block, index);
          case "image":
            return renderImage(block, index);
          case "code":
            return renderCode(block, index);
          default:
            return null;
        }
      })}
    </div>
  );
}
