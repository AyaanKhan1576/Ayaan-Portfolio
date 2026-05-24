import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-none border-2 border-[#111111] bg-white/90 shadow-[3px_3px_0_rgba(17,17,17,0.08)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-0", className)} {...props} />;
}
