import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, FileText, Github, Linkedin, Mail, X } from 'lucide-react';
import { PROFILE, SECTIONS } from '../data/content';
import { scrollToSection, useActiveSection } from '../lib/scroll';
import { settingsStore, uiStore, useSettings, useUi, type MotionPref, type QualityPref } from '../lib/settings';
import { sound } from '../lib/sound';
import { EASE_OUT } from '../components/ui';

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="font-hud text-[0.82rem] font-semibold tracking-[0.14em] text-ink-soft">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex overflow-hidden rounded-md border border-white/10 bg-night-950/60 p-0.5">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                sound.click();
                onChange(o.value);
              }}
              className={`rounded-[5px] px-3 py-1.5 font-hud text-[0.72rem] font-bold tracking-[0.14em] transition-colors ${
                on ? 'bg-sunset text-night-950' : 'text-ink-mute hover:text-ink'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Full-screen pause menu: fast travel, settings and quick links. Opens with M or the MENU button. */
export const PauseMenu: React.FC = () => {
  const { menuOpen } = useUi();
  const settings = useSettings();
  const active = useActiveSection();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = () => {
    sound.close();
    uiStore.set({ menuOpen: false });
  };

  // focus management + focus trap
  useEffect(() => {
    if (!menuOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') ?? []);
    window.setTimeout(() => {
      const list = focusables();
      (list.find((el) => el.dataset.current === 'true') ?? list[0])?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [menuOpen]);

  const travel = (id: string) => {
    sound.click(660);
    uiStore.set({ menuOpen: false });
    // let the scroll lock release before travelling
    window.setTimeout(() => scrollToSection(id), 60);
  };

  const links = [
    { label: 'EMAIL', value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: Mail, external: false },
    { label: 'GITHUB', value: 'github.com/andikaprasetyaaa', href: PROFILE.githubUrl, icon: Github, external: true },
    { label: 'LINKEDIN', value: 'linkedin.com/in/andikaprasetya', href: PROFILE.linkedinUrl, icon: Linkedin, external: true },
    { label: 'RESUME', value: 'CV Dossier [Google Drive]', href: PROFILE.cvUrl, icon: FileText, external: true },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="pause"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-night-950/90 backdrop-blur-md" onClick={close} aria-hidden="true" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 50% at 85% 100%, rgba(255,95,168,0.16), transparent 70%), radial-gradient(50% 40% at 0% 0%, rgba(157,107,255,0.16), transparent 70%)',
            }}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className="relative flex h-full flex-col overflow-y-auto px-gutter pb-10 pt-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl tracking-[0.06em] text-sunset sm:text-4xl">PAUSED</span>
                <span className="hud-label hidden sm:inline">{PROFILE.location}</span>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-night-900/60 px-3 font-hud text-[0.74rem] font-semibold tracking-[0.16em] text-ink-soft transition-colors hover:border-vice-pink/60 hover:text-ink"
              >
                <X className="h-4 w-4" />
                <span>BACK</span>
                <kbd className="hidden sm:inline rounded border border-white/15 px-1.5 py-0.5 text-[0.62rem] text-ink-mute">ESC</kbd>
              </button>
            </div>
            <div className="hairline mt-5" />

            <div className="mx-auto grid w-full max-w-shell flex-1 grid-cols-1 gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
              {/* fast travel */}
              <nav aria-label="Fast travel" className="lg:col-span-7">
                <p className="hud-label mb-4">FAST TRAVEL</p>
                <ul className="flex flex-col">
                  {SECTIONS.map((s, i) => {
                    const current = i === active;
                    return (
                      <motion.li
                        key={s.id}
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55, delay: 0.05 + i * 0.045, ease: EASE_OUT }}
                      >
                        <button
                          type="button"
                          data-current={current}
                          onClick={() => travel(s.id)}
                          onMouseEnter={() => sound.hover()}
                          onFocus={() => sound.hover()}
                          className="group relative flex w-full items-center gap-4 border-b border-white/[0.07] py-3 pl-4 pr-2 text-left transition-colors duration-300 hover:bg-white/[0.04] focus-visible:bg-white/[0.06] sm:gap-6 sm:py-4"
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute inset-y-2 left-0 w-1 rounded-full bg-sunset transition-transform duration-300 origin-center ${
                              current ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100'
                            }`}
                          />
                          <span className="w-8 font-hud text-sm font-bold text-vice-amber">{s.index}</span>
                          <span className="flex-1">
                            <span
                              className={`block font-display text-[1.9rem] uppercase leading-none tracking-[0.02em] transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5 sm:text-[2.6rem] ${
                                current ? 'text-sunset' : 'text-ink'
                              }`}
                            >
                              {s.label}
                            </span>
                            <span className="mt-1.5 block text-sm text-ink-mute">{s.teaser}</span>
                          </span>
                          {current && <span className="chip hidden sm:inline-flex !text-vice-teal">YOU ARE HERE</span>}
                          <kbd className="hidden rounded border border-white/15 px-2 py-1 font-hud text-[0.7rem] text-ink-mute md:inline">{i + 1}</kbd>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* settings + links */}
              <motion.div
                className="flex flex-col gap-8 lg:col-span-5"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: EASE_OUT }}
              >
                <section aria-label="Settings" className="panel panel-accent p-5 sm:p-6">
                  <p className="hud-label mb-2">SETTINGS</p>
                  <div className="divide-y divide-white/[0.07]">
                    <Segmented
                      label="SOUND FX"
                      value={settings.sound ? 'on' : 'off'}
                      options={[
                        { value: 'off', label: 'OFF' },
                        { value: 'on', label: 'ON' },
                      ]}
                      onChange={(v) => {
                        if ((v === 'on') !== settings.sound) sound.toggle();
                      }}
                    />
                    <Segmented<MotionPref>
                      label="MOTION"
                      value={settings.motion}
                      options={[
                        { value: 'full', label: 'FULL' },
                        { value: 'reduced', label: 'REDUCED' },
                      ]}
                      onChange={(v) => settingsStore.set({ motion: v })}
                    />
                    <Segmented<QualityPref>
                      label="GRAPHICS"
                      value={settings.quality}
                      options={[
                        { value: 'auto', label: 'AUTO' },
                        { value: 'high', label: 'HIGH' },
                        { value: 'low', label: 'LOW' },
                      ]}
                      onChange={(v) => settingsStore.set({ quality: v })}
                    />
                  </div>
                </section>

                <section aria-label="Quick links">
                  <p className="hud-label mb-3">DIRECT LINES</p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target={l.external ? '_blank' : undefined}
                          rel={l.external ? 'noopener noreferrer' : undefined}
                          onMouseEnter={() => sound.hover()}
                          onClick={() => sound.click()}
                          className="group flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-3 transition-colors hover:border-vice-pink/50 hover:bg-white/[0.06]"
                        >
                          <l.icon className="h-4 w-4 shrink-0 text-vice-pink" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-hud text-[0.74rem] font-bold tracking-[0.16em] text-ink">{l.label}</span>
                            <span className="block truncate text-xs text-ink-mute">{l.value}</span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                <p className="hud-label hidden !leading-loose md:block">
                  CONTROLS — <span className="text-ink-soft">1–6</span> FAST TRAVEL · <span className="text-ink-soft">M</span> MENU ·{' '}
                  <span className="text-ink-soft">ESC</span> BACK
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
