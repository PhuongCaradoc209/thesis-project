import { useTourismStore } from '../../store/useTourismStore';

export default function TeleportTransition() {
  const isTeleporting = useTourismStore((state) => state.isTeleporting);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-100 bg-black transition-opacity duration-300 ease-in-out ${
        isTeleporting ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
