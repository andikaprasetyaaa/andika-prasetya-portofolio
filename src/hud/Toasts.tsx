import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { useToasts } from '../lib/toast';
import { EASE_OUT } from '../components/ui';

/** HUD notification feed (bottom-left on desktop, bottom-centre on phones). */
export const Toasts: React.FC = () => {
  const toasts = useToasts();
  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-5 z-[55] flex flex-col-reverse items-center gap-2 sm:inset-x-auto sm:left-6 sm:items-start"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.96 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-night-850/95 py-3 pl-4 pr-5 shadow-panel"
          >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-sunset" />
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                t.tone === 'success' ? 'bg-vice-teal/15 text-vice-teal' : 'bg-vice-pink/15 text-vice-pink'
              }`}
            >
              {t.tone === 'success' ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            </span>
            <span className="font-hud text-[0.8rem] font-semibold tracking-[0.14em] text-ink">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
