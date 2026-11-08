const COMPASS_IMAGE = '/common/image/compact.png';

type CompassProps = {
  bearing: number;
};

const Compass = ({ bearing }: CompassProps) => (
  <img
    src={COMPASS_IMAGE}
    alt=''
    draggable={false}
    className='block h-full w-full object-contain [filter:drop-shadow(0_0_1.5px_#fffaf0)_drop-shadow(0_0_6px_rgba(255,250,240,.8))]'
    style={{ transform: `rotate(${-bearing}deg)` }}
  />
);

export default Compass;
