import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BatteryMedium,
  Check,
  Clock,
  Copy,
  Download,
  FileText,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Signal,
  type LucideIcon,
} from 'lucide-react';
import { CONTACT, PROFILE, type ChannelIcon } from '../data/content';
import { sound } from '../lib/sound';
import { notify } from '../lib/toast';
import { ChapterTitle, Reveal, SectionShell, StageFooter, StatusDot, Tilt } from '../components/ui';

const CHANNEL_ICONS: Record<ChannelIcon, LucideIcon> = { github: Github, linkedin: Linkedin, globe: Globe, file: FileText };
const CHANNEL_ACCENTS = ['#ff5fa8', '#72c6ff', '#45e3d0', '#ffc46b'];

/** Live clock for Bali (WITA, UTC+8) */
function useBaliTime() {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Makassar' }).format(
      new Date(),
    );
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 20000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // clipboard API unavailable (older browser / insecure context) — fall back to a hidden field
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const time = useBaliTime();

  const copyEmail = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const ok = await copyText(PROFILE.email);
    if (!ok) {
      notify('COPY FAILED — SELECT THE ADDRESS MANUALLY');
      return;
    }
    sound.success();
    notify(CONTACT.inbox.toast, 'success');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2600);
  };

  return (
    <>
      <SectionShell id="contact" labelledBy="contact-title">
        <ChapterTitle id="contact" status={CONTACT.status} />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ------- left: the pitch + inbox ------- */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Reveal>
              <p className="hud-label flex flex-wrap items-center gap-2.5">
                <span>{CONTACT.destinationLabel}</span>
                <span aria-hidden="true" className="text-vice-pink">
                  —&gt;
                </span>
                <span className="text-ink">{CONTACT.destination}</span>
              </p>
              <h2
                id="contact-title"
                className="mt-4 font-display text-[clamp(2.7rem,7.2vw,6.3rem)] uppercase leading-[0.93] tracking-[0.005em] text-ink"
              >
                LET&apos;S BUILD SOMETHING <span className="text-sunset">INTELLIGENT.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-ink-soft">{CONTACT.lead}</p>
            </Reveal>

            {/* inbox */}
            <Reveal delay={0.06}>
              <div
                onClick={() => copyEmail()}
                data-cursor="link"
                className="panel panel-accent group cursor-pointer p-5 transition-[border-color,box-shadow] duration-500 hover:border-vice-pink/55 hover:shadow-glow sm:p-7"
              >
                <div className="flex items-center gap-2.5">
                  <StatusDot ping />
                  <span className="hud-label">{CONTACT.inbox.label}</span>
                </div>
                <a
                  href={`mailto:${PROFILE.email}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.click(600);
                  }}
                  className="mt-4 block break-all font-display text-[clamp(1.45rem,3.5vw,2.75rem)] uppercase leading-[1.05] text-ink transition-colors duration-300 hover:text-vice-gold"
                >
                  {PROFILE.email}
                </a>
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="hud-label !leading-relaxed">{CONTACT.inbox.hint}</p>
                  <div className="flex shrink-0 items-center gap-3 pl-1.5">
                    <button type="button" onClick={copyEmail} className="btn btn-ghost btn-sm" onMouseEnter={() => sound.hover()}>
                      {copied ? <Check className="h-4 w-4 text-vice-teal" /> : <Copy className="h-4 w-4" />}
                      <span aria-live="polite">{copied ? CONTACT.inbox.copied : CONTACT.inbox.copy}</span>
                    </button>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      aria-label={`Send an email to ${PROFILE.email}`}
                      title="Send email"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.click(600);
                      }}
                      onMouseEnter={() => sound.hover()}
                      className="btn btn-primary btn-sm !px-3.5"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* live status */}
            <Reveal delay={0.1}>
              <div className="panel grid grid-cols-1 gap-6 p-5 sm:p-6 md:grid-cols-2 md:gap-7">
                <div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-vice-pink" aria-hidden="true" />
                    <span className="hud-label !text-ink">{CONTACT.location.label}</span>
                  </div>
                  <p className="mt-2.5 text-[0.95rem] font-semibold leading-snug text-ink">{CONTACT.location.value}</p>
                  <p className="mt-2 font-mono text-[0.7rem] leading-relaxed text-ink-mute">{CONTACT.location.note}</p>
                </div>
                <div className="md:border-l md:border-white/[0.08] md:pl-7">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-vice-pink" aria-hidden="true" />
                    <span className="hud-label !text-ink">{CONTACT.readiness.label}</span>
                  </div>
                  <p className="mt-2.5 text-[0.95rem] font-semibold leading-snug text-ink">{CONTACT.readiness.value}</p>
                  <p className="mt-2 font-mono text-[0.7rem] leading-relaxed text-ink-mute">{CONTACT.readiness.note}</p>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vice-teal/10">
                      <StatusDot ping />
                    </span>
                    <p className="hud-label">{CONTACT.heartbeat.label}</p>
                  </div>
                  <p className="whitespace-nowrap font-hud text-[0.8rem] font-bold tracking-[0.08em] text-vice-mint sm:text-[0.86rem]">
                    {CONTACT.heartbeat.value}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ------- right: in-game phone with the direct channels ------- */}
          <Reveal className="lg:col-span-5" x={24} y={0} delay={0.08}>
            <Tilt
              max={4}
              className="relative mx-auto w-full max-w-[372px] rounded-[2.9rem] border border-white/15 bg-night-950 p-2.5 shadow-[0_40px_90px_-30px_rgba(4,2,10,0.95),0_0_0_1px_rgba(255,95,168,0.12)]"
            >
              <div className="relative overflow-hidden rounded-[2.35rem] border border-white/[0.06] bg-gradient-to-b from-[#1c1035] via-[#130a25] to-[#0c0717]">
                {/* status bar */}
                <div className="flex items-center justify-between px-6 pb-1 pt-3.5 font-hud text-[0.72rem] font-semibold text-ink">
                  <span title="Local time in Bali">{time} WITA</span>
                  <span aria-hidden="true" className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-night-950" />
                  <span className="flex items-center gap-1.5 text-ink-soft" aria-hidden="true">
                    <Signal className="h-3.5 w-3.5" />
                    <BatteryMedium className="h-4 w-4" />
                  </span>
                </div>

                <div className="px-4 pb-2 pt-4">
                  <p className="hud-label !text-[0.66rem]">{CONTACT.channels.length} DIRECT LINES</p>
                  <p className="mt-1 font-display text-[1.7rem] uppercase leading-none text-ink">Channels</p>
                </div>

                <ul className="flex flex-col gap-2 px-3 pb-3">
                  {CONTACT.channels.map((ch, i) => {
                    const Icon = CHANNEL_ICONS[ch.icon];
                    const accent = CHANNEL_ACCENTS[i];
                    return (
                      <li key={ch.id}>
                        <a
                          href={ch.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.click(500)}
                          onMouseEnter={() => sound.hover()}
                          className="group block rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3.5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                              style={{ background: `${accent}22`, color: accent }}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="hud-label !text-[0.6rem]">
                                {ch.id} // {ch.kicker}
                              </p>
                              <p className="mt-0.5 font-hud text-[0.98rem] font-bold tracking-[0.04em] text-ink">{ch.title}</p>
                              <p className="truncate font-mono text-[0.68rem] text-ink-mute">{ch.handle}</p>
                            </div>
                            {ch.icon === 'file' ? (
                              <Download className="h-4 w-4 shrink-0 text-ink-mute transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-ink" aria-hidden="true" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                            )}
                          </div>
                          <dl className="mt-3 flex flex-col gap-1 border-t border-white/[0.07] pt-2.5">
                            {ch.stats.map((s) => (
                              <div key={s.label} className="flex items-center justify-between gap-3">
                                <dt className="font-hud text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">{s.label}</dt>
                                <dd className="font-hud text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink">{s.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <div aria-hidden="true" className="mx-auto mb-2.5 h-1 w-28 rounded-full bg-white/25" />
              </div>
            </Tilt>
          </Reveal>
        </div>

        <StageFooter id="contact" left="TERMINAL HANDSHAKE" right={PROFILE.location} />
      </SectionShell>

      {/* closing vista + footer */}
      <footer className="relative z-10">
        <div className="h-[30vh]" aria-hidden="true" />
        <div className="bg-gradient-to-t from-night-950/95 via-night-950/70 to-transparent pb-8 pt-20">
          <div className="shell flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-hud text-[0.8rem] font-bold uppercase tracking-[0.16em] text-ink">{CONTACT.footer.system}</p>
              <p className="hud-label mt-1.5">{CONTACT.footer.systemNote}</p>
            </div>
            <p className="hud-label !text-ink-soft">
              © {new Date().getFullYear()} {CONTACT.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
