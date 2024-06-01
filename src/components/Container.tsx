import { cn } from "~/lib/utils";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
