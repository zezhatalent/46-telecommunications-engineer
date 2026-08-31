import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { content } from './content';
import { useTheme } from './components/ThemeProvider';

function SignalWaveSVG() {
  const { theme } = useTheme();
  return (
    <svg viewBox="0 0 640 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="sig-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={theme.accent} stopOpacity="0.3" /><stop offset="1" stopColor={theme.accent2} stopOpacity="0.3" /></linearGradient></defs>
      {[0, 1, 2].map((i) => (
        <motion.path key={i}
          d={`M0 ${150 + i * 20} Q160 ${100 + i * 30} 320 ${150 + i * 20} Q480 ${200 + i * 30} 640 ${150 + i * 20}`}
          fill="none" stroke="url(#sig-grad)" strokeWidth={2 - i * 0.5}
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: 'reverse' }} />
      ))}
      {[100, 250, 400, 540].map((x, i) => (
        <motion.circle key={i} cx={x} cy={150} r={4} fill={theme.accent}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </svg>
  );
}

function FloatingSignal({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  const { theme } = useTheme();
  return (
    <motion.div className="absolute pointer-events-none" style={{ left: x, top: y }}
      animate={{ y: [0, -20, 0], opacity: [0.15, 0.4, 0.15] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke={theme.accent} strokeWidth="1" opacity="0.2" />
        <circle cx="12" cy="12" r="4" stroke={theme.accent} strokeWidth="1" opacity="0.3" />
        <circle cx="12" cy="12" r="2" fill={theme.accent} opacity="0.4" />
      </svg>
    </motion.div>
  );
}

export default function Hero() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, 1], [-15, 15]);
  const bgY = useTransform(mouseY, [0, 1], [-15, 15]);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => { const rect = el.getBoundingClientRect(); mouseX.set((e.clientX - rect.left) / rect.width); mouseY.set((e.clientY - rect.top) / rect.height); };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);
  return (
    <section ref={sectionRef} id="hero" className="relative flex min-h-screen items-center overflow-hidden" style={{ background: theme.bg }}>
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: bgX, y: bgY }}><SignalWaveSVG /></motion.div>
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(700px circle at 30% 20%, ${theme.accent}1a, transparent)` }} />
      <FloatingSignal delay={0} x="10%" y="15%" size={40} /><FloatingSignal delay={1.5} x="85%" y="25%" size={30} /><FloatingSignal delay={3} x="75%" y="70%" size={35} />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: theme.accent }}>{content.role}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-5xl font-extrabold md:text-6xl" style={{ color: theme.text }}>
            {content.name.split('').map((char, i) => (<motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.03 }}>{char}</motion.span>))}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }} className="mt-3 text-xl font-light" style={{ color: theme.muted }}>{content.tagline}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-9 flex flex-wrap gap-4">
            <motion.a href="#projects" className="rounded px-7 py-3 font-semibold text-white" style={{ background: theme.accent }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>View my work</motion.a>
            <motion.a href="#contact" className="rounded border px-7 py-3 font-semibold" style={{ borderColor: theme.accent, color: theme.accent }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Hire me</motion.a>
          </motion.div>
        </div>
        <motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.6 }}>
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ borderColor: theme.border, background: theme.surface, boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: theme.text }}>live · signal net</span>
              <motion.span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${theme.accent}22`, color: theme.accent }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>● transmitting</motion.span>
            </div>
            <div className="mt-6 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div key={i} className="flex items-center gap-2" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>
                  <div className="h-1 rounded" style={{ width: `${30 + Math.random() * 70}%`, background: i % 2 === 0 ? theme.accent : theme.accent2 }} />
                </motion.div>
              ))}
            </div>
            <div className="mt-5 rounded-xl p-3" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
              <div className="flex justify-between text-xs">
                <span style={{ color: theme.muted }}>5000+ sites · 2M subscribers</span>
                <span className="font-mono font-bold" style={{ color: theme.accent }}>99.99% uptime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
