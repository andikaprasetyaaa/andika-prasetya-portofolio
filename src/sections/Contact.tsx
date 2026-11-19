import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BatteryMedium,
  Check,
  Copy,
  Download,
  FileText,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Radio,
  Signal,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { CONTACT, PROFILE, type ChannelIcon } from '../data/content';
import { useSettings } from '../lib/settings';
import { RADIO_STATIONS, sound } from '../lib/sound';
import { notify } from '../lib/toast';
import { ChapterTitle, Reveal, SectionShell, StatusDot, Tilt } from '../components/ui';

const CHANNEL_ICONS: Record<ChannelIcon, LucideIcon> = { github: Github, linkedin: Linkedin, globe: Globe, file: FileText };
const CHANNEL_ACCENTS = ['#ff5fa8', '#72c6ff', '#45e3d0', '#ffc46b'];

/** Live clock for Gianyar, Bali (WITA, UTC+8) */
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
  const settings = useSettings();
  const station = RADIO_STATIONS[settings.station % RADIO_STATIONS.length] ?? RADIO_STATIONS[0];

  const copyEmail = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const ok = await copyText(PROFILE.email);
    if (!ok) {
      notify('Copy failed — select the address manually');
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
        <ChapterTitle
          id="contact"
          titleId="contact-title"
          heading={
            <>
              LET&apos;S BUILD SOMETHING <span className="text-sunset">INTELLIGENT.</span>
            </>
          }
          lead={CONTACT.lead}
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Direct Inbox & Gianyar Location Card */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Reveal>
              <div
                onClick={() => copyEmail()}
                data-cursor="link"
                className="panel panel-accent group cursor-pointer p-6 transition-[border-color,box-shadow] duration-500 hover:border-vice-pink/55 hover:shadow-glow sm:p-8"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <StatusDot ping />
                    <span className="hud-label">{CONTACT.inbox.label}</span>
                  </div>
                  <span className="chip !border-vice-teal/35 !bg-vice-teal/10 !text-vice-mint">
                    {PROFILE.availability}
                  </span>
                </div>

                <a
                  href={`mailto:${PROFILE.email}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.click(600);
                  }}
                  className="mt-5 block break-all font-display text-[clamp(1.3rem,3.1vw,2.5rem)] font-bold uppercase leading-[1.08] tracking-[0.02em] text-ink transition-colors duration-300 hover:text-vice-gold"
                >
                  {PROFILE.email}
                </a>

                <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-ink-mute sm:text-sm">{CONTACT.inbox.hint}</p>
                  <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="btn btn-ghost btn-sm flex-1 sm:flex-initial"
                      onMouseEnter={() => sound.hover()}
                    >
                      {copied ? <Check className="h-4 w-4 text-vice-teal" /> : <Copy className="h-4 w-4" />}
                      <span aria-live="polite">{copied ? CONTACT.inbox.copied : CONTACT.inbox.copy}</span>
                    </button>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      aria-label={`Send an email to ${PROFILE.email}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.click(600);
                      }}
                      onMouseEnter={() => sound.hover()}
                      className="btn btn-primary btn-sm flex-1 sm:flex-initial"
                    >
                      EMAIL ME
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vice-coral/15 text-vice-coral">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="hud-label !text-[0.7rem]">BASE OF OPERATIONS</p>
                    <p className="mt-0.5 text-sm font-semibold text-ink">{PROFILE.location}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-ink-mute">{PROFILE.coords}</span>
              </div>
            </Reveal>
          </div>

          {/* Right: Authentic Vertical 9:18.5 Smartphone Silhouette (Never Gepeng!) */}
          <Reveal className="flex justify-center lg:col-span-5" x={20} y={0} delay={0.08}>
            <Tilt
              max={4}
              className="relative mx-auto w-[284px] sm:w-[304px] rounded-[2.9rem] border-[2px] border-white/20 bg-night-950 p-2.5 shadow-[0_36px_80px_-24px_rgba(4,2,10,0.95),0_0_0_1px_rgba(255,95,168,0.16)]"
            >
              {/* Side hardware buttons */}
              <span aria-hidden="true" className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-white/25" />
              <span aria-hidden="true" className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-white/25" />
              <span aria-hidden="true" className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-r bg-white/25" />

              <div className="relative flex min-h-[556px] flex-col justify-between overflow-hidden rounded-[2.35rem] border border-white/[0.08] bg-gradient-to-b from-[#231242] via-[#130a25] to-[#0a0514]">
                {/* Top Status Bar + Dynamic Island */}
                <div>
                  <div className="relative flex items-center justify-between px-6 pb-2 pt-3.5 font-hud text-xs font-bold tracking-wider text-ink">
                    <span title="Local time in Gianyar, Bali">{time}</span>
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-2.5 flex h-5 w-24 -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#1a1a2e] ring-1 ring-white/15" />
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-soft" aria-hidden="true">
                      <Signal className="h-3 w-3" />
                      <Wifi className="h-3 w-3" />
                      <BatteryMedium className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Lockscreen / Home Clock & Gianyar Widget */}
                  <div className="mx-3.5 mt-2 rounded-2xl border border-white/10 bg-gradient-to-br from-vice-pink/20 via-vice-coral/10 to-vice-violet/20 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-poster text-4xl font-normal leading-none tracking-wider text-ink">{time}</p>
                        <p className="mt-1 font-hud text-[0.7rem] font-bold uppercase tracking-[0.18em] text-vice-gold">
                          GIANYAR, BALI &middot; WITA
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => sound.nextStation()}
                        title="Switch GTA Radio Track"
                        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-night-950/70 px-2.5 py-1.5 font-hud text-[0.68rem] font-bold uppercase tracking-[0.14em] text-vice-pink transition-colors hover:border-vice-amber hover:text-vice-gold"
                      >
                        <Radio className="h-3 w-3" />
                        <span>{station.name}</span>
                      </button>
                    </div>
                  </div>

                  <div className="px-5 pb-2 pt-4">
                    <p className="hud-label !text-[0.68rem] text-vice-coral">{CONTACT.eyebrow}</p>
                    <p className="mt-0.5 font-poster text-2xl font-normal uppercase leading-none tracking-[0.04em] text-ink">
                      iFruit Contacts
                    </p>
                  </div>

                  {/* 4 Contact Channels */}
                  <ul className="flex flex-col gap-2 px-3.5">
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
                            className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09]"
                          >
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                              style={{ background: `${accent}24`, color: accent }}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-hud text-sm font-bold uppercase tracking-[0.08em] text-ink">{ch.title}</p>
                              <p className="truncate text-[0.72rem] text-ink-mute">{ch.handle}</p>
                            </div>
                            {ch.icon === 'file' ? (
                              <Download
                                className="h-4 w-4 shrink-0 text-ink-mute transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-ink"
                                aria-hidden="true"
                              />
                            ) : (
                              <ArrowUpRight
                                className="h-4 w-4 shrink-0 text-ink-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                                aria-hidden="true"
                              />
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Bottom Home Bar */}
                <div className="pb-2.5 pt-3 text-center">
                  <div aria-hidden="true" className="mx-auto h-1 w-28 rounded-full bg-white/30" />
                </div>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </SectionShell>

      {/* Clean footer with proper clearance so the phone never overlaps it */}
      <footer className="relative z-10 mt-8">
        <div className="bg-gradient-to-t from-night-950/95 via-night-950/75 to-transparent pb-20 pt-12 xl:pb-8">
          <div className="shell flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-hud text-sm font-bold uppercase tracking-[0.18em] text-ink">{PROFILE.name}</p>
            <p className="text-xs text-ink-mute">
              &copy; {new Date().getFullYear()} {CONTACT.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
