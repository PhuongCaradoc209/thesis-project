import type { TargetAndTransition, Transition } from 'motion/react';

export type TearDirection = 'side' | 'down';

const zigzag = (toPoint: (index: number) => string) => Array.from({ length: 21 }, (_, index) => toPoint(index)).join(', ');

export const STUB_EDGE: Record<TearDirection, string> = {
  side: `polygon(100% 0, 100% 100%, ${zigzag((i) => `${i % 2 ? 8 : 0}px ${100 - i * 5}%`)})`,
  down: `polygon(${zigzag((i) => `${i * 5}% ${i % 2 ? 8 : 0}px`)}, 100% 100%, 0 100%)`,
};

export const PICTURE_EDGE: Record<TearDirection, string> = {
  side: `polygon(0 0, ${zigzag((i) => `calc(100% - ${i % 2 ? 0 : 8}px) ${i * 5}%`)}, 0 100%)`,
  down: `polygon(0 0, 100% 0, ${zigzag((i) => `${100 - i * 5}% calc(100% - ${i % 2 ? 0 : 8}px)`)})`,
};

export const STUB_MOTION: Record<TearDirection, TargetAndTransition> = {
  side: { x: [0, -4, 110], y: [0, 4, 70], rotate: [0, -2, 14], opacity: [1, 1, 0] },
  down: { x: [0, 0, 36], y: [0, -5, 120], rotate: [0, 1, 8], opacity: [1, 1, 0] },
};

export const STUB_REST: TargetAndTransition = { x: 0, y: 0, rotate: 0, opacity: 1 };

export const TEAR_TRANSITION: Transition = { duration: 0.75, times: [0, 0.22, 1], ease: 'easeIn' };
