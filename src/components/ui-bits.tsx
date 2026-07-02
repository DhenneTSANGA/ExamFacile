import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Card({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-card rounded-2xl border border-border shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GradientButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-semibold shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border font-semibold hover:bg-muted transition-all ${className}`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-muted overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full gradient-brand rounded-full"
      />
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-display">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
