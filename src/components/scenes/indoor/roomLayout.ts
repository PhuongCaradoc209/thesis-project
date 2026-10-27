// Bố cục phòng trưng bày (nhìn từ trên xuống), đơn vị mét, tâm sàn ở (0, 0, 0).
// Người chơi đi theo hướng +x: hành lang ở phía z âm, 4 gian trưng bày ở phía z dương.
//
//   x = -8                                 x = 8
//   ┌────────────────────────────────────────┐ z = -5
//   │ ●  hành lang  →→→→→→→→→→→→→→→→→→→→→→→  │
//   ├─────────┬─────────┬─────────┬──────────┤ z = -2
//   │ gian 1  │ gian 2  │ gian 3  │ gian 4   │
//   └─────────┴─────────┴─────────┴──────────┘ z = 5
//            x=-4      x=0       x=4   ← vách ngăn

export const ROOM_LENGTH = 16; // trục x
export const ROOM_HEIGHT = 4; // trục y
export const ROOM_WIDTH = 10; // trục z
export const WALL_THICKNESS = 0.2;

// Mép hành lang, vách ngăn chạy từ đây tới tường z = 5
export const CORRIDOR_EDGE_Z = -2;
export const PARTITION_XS = [-4, 0, 4];

// Tâm 4 gian theo trục x, dùng để đặt đèn
export const BAY_CENTER_XS = [-6, -2, 2, 6];

// Chiều cao bục: hiện vật được đặt lên mặt bục ở độ cao này
export const PEDESTAL_HEIGHT = 1;

// Mỗi gian 2 bục. Hiện vật có `pedestal: 0` nằm ở vị trí đầu mảng, `pedestal: 1` ở vị trí thứ hai...
export const PEDESTAL_POSITIONS: [number, number, number][] = [
  [-6, 0, 0.5],
  [-6, 0, 3],
  [-2, 0, 0.5],
  [-2, 0, 3],
  [2, 0, 0.5],
  [2, 0, 3],
  [6, 0, 0.5],
  [6, 0, 3],
];
