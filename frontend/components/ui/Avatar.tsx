import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  isAI?: boolean;
  children?: React.ReactNode;
}

const sizeStyles = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  isAI,
  children,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl flex items-center justify-center font-semibold shrink-0 overflow-hidden",
        sizeStyles[size],
        isAI
          ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30"
          : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? fallback}
          className="h-full w-full object-cover"
        />
      ) : children ? (
        children
      ) : (
        <span>{fallback}</span>
      )}
      {isAI && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
      )}
    </div>
  );
}
