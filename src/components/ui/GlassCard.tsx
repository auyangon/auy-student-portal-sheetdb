import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "button";
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  as = "div",
  onClick,
}: GlassCardProps) {
  const Component = as as any;

  return (
    <motion.div
      initial={false}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Component
        onClick={onClick}
        className={`
          relative overflow-hidden rounded-[24px] border border-white/50
          bg-[rgba(255,255,255,0.70)] backdrop-blur-[20px] 
          shadow-[0_8px_32px_rgba(0,0,0,0.04)]
          ${hover ? "cursor-pointer transition-all duration-200" : ""}
          ${className}
        `}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/30" />
        {children}
      </Component>
    </motion.div>
  );
}
