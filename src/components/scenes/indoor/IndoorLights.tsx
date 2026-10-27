import { Environment } from '@react-three/drei';
import { SKY_HDR_URL } from '../AnimateSky';
import { BAY_CENTER_XS, ROOM_HEIGHT } from './roomLayout';

const LAMP_COLOR = '#fff1dc';
const LAMP_Y = ROOM_HEIGHT - 0.25;
const LAMP_INTENSITY = 20;

// Một đèn trần: nguồn sáng + tấm phát sáng để nhìn thấy đèn
function CeilingLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <pointLight color={LAMP_COLOR} intensity={LAMP_INTENSITY} />
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.6, 0.04, 1.2]} />
        <meshBasicMaterial color={LAMP_COLOR} />
      </mesh>
    </group>
  );
}

export function IndoorLights() {
  return (
    <>
      {/* Ánh sáng nền cho cả phòng: trời trắng ấm, "đất" sáng để trần không bị tối */}
      <hemisphereLight args={['#fff8ee', '#e6d6bd', 1.1]} />

      {/* Ánh sáng phản xạ nhẹ từ ảnh HDR có sẵn, để tường và sàn không bị lì, phẳng */}
      <Environment files={SKY_HDR_URL} environmentIntensity={0.35} />

      {/* Mỗi gian một đèn trần (không đổ bóng để nhẹ máy) */}
      {BAY_CENTER_XS.map((x) => (
        <CeilingLamp key={x} position={[x, LAMP_Y, 1.5]} />
      ))}

      {/* 2 đèn dọc hành lang */}
      <CeilingLamp position={[-4, LAMP_Y, -3.5]} />
      <CeilingLamp position={[4, LAMP_Y, -3.5]} />
    </>
  );
}
