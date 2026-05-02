import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand mark used everywhere a logo appears (navbars, footers, login,
 * report headers, etc.). Drop the source PNG/SVG at
 *   frontend/public/zenlife-logo.png
 * and every page picks it up automatically.
 *
 * Sizes are nominal — tweak `size` per call site to match the surrounding
 * chrome (most use cases sit between 24-40px).
 */
export function Logo({
  size = 32,
  className,
  alt = "ZenLife",
  priority = false,
}: {
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/zenlife-logo.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
