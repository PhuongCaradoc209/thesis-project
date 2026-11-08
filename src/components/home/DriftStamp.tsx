import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type DriftStampProps = {
  children: ReactNode;
};

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const DriftStamp = ({ children }: DriftStampProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [start] = useState(() => ({
    angle: randomBetween(0, Math.PI * 2),
    reach: randomBetween(0.25, 0.45),
    rotate: randomBetween(-18, 18),
    end: randomBetween(0.35, 0.55),
  }));
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', `start ${start.end}`] });
  const startX = Math.cos(start.angle) * start.reach * viewport.width;
  const startY = Math.sin(start.angle) * start.reach * viewport.height;
  const x = useTransform(scrollYProgress, [0, 1], [startX, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [startY, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [start.rotate, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.2, 1]);

  useEffect(() => {
    const measure = () => setViewport({ width: window.innerWidth, height: window.innerHeight });

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div ref={ref}>
      <motion.div style={reduceMotion ? undefined : { x, y, rotate, opacity }}>{children}</motion.div>
    </div>
  );
};

export default DriftStamp;
