<div align="center">

# VIETNAM VIRTUAL

### WebGL Virtual Heritage Tourism

*Khám phá di sản Việt Nam qua không gian 3D tương tác ngay trên trình duyệt.*

`React` · `TypeScript` · `Three.js` · `React Three Fiber` · `Firebase`

</div>

---

## ◆ Giới thiệu

Vietnam Virtual là ứng dụng du lịch di sản ảo được phát triển cho đồ án tốt nghiệp. Người dùng có thể chọn địa điểm trên bản đồ, tự do tham quan không gian 3D, dịch chuyển nhanh giữa các khu vực và xem chi tiết hiện vật với nội dung chú thích tương tác.

```text
Bản đồ di sản → Tải scene → Tham quan tự do → Tương tác hotspot → Khám phá hiện vật
```

Hai địa điểm demo hiện tại:

- Lăng Tự Đức — Huế.
- Đền thờ Vua Hùng — Cần Thơ.

## ◆ Trải nghiệm chính

- Bản đồ vệ tinh MapLibre/MapTiler có terrain 3D và marker địa điểm.
- Scene WebGL được cấu hình động từ Firebase Firestore.
- Di chuyển góc nhìn thứ nhất với Pointer Lock và vật lý Rapier.
- Collision, teleport, respawn và kill plane theo từng scene.
- Terrain PBR hỗ trợ splat map, height map và nhiều lớp vật liệu.
- Asset GLB generic tải trực tiếp từ URL; asset đặc biệt dùng custom renderer.
- Preview hiện vật dùng chung WebGL renderer với scene chính.
- Orbit, zoom, reset camera và cấu hình tâm xoay cho từng hiện vật.
- Annotation 3D có occlusion, animation, nội dung song ngữ và ảnh minh họa.
- Loading, error boundary và retry riêng cho model.
- Giao diện tiếng Việt và tiếng Anh bằng i18next.
- Leva và bảng FPS chỉ xuất hiện trong môi trường development.

## ◆ Công nghệ

| Nhóm | Công nghệ |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS 4, Motion |
| 3D | Three.js, React Three Fiber, Drei |
| Physics | Rapier |
| State & data | Zustand, TanStack Query |
| Backend | Firebase Firestore |
| Asset delivery | Cloudinary |
| Map | MapLibre, react-map-gl, MapTiler |
| i18n | i18next, react-i18next |

## ◆ Chạy project

### Yêu cầu

- Git.
- Bun được khuyến nghị vì repository có `bun.lock`.
- MapTiler public API key.
- Trình duyệt hỗ trợ WebGL 2.

### Cài đặt

```bash
git clone <repository-url>
cd thesis-practice
bun install
```

Tạo `.env.local` tại thư mục root:

```dotenv
VITE_MAPTILER_KEY=your_maptiler_public_key
```

Khởi động development server:

```bash
bun run dev
```

Mở URL Vite hiển thị trong terminal, thường là `http://localhost:5173`.

> Firebase web configuration hiện nằm trong `src/config/firebase.ts`. Không đưa service-account key hoặc Cloudinary secret vào frontend.

## ◆ Điều khiển

| Thao tác | Điều khiển |
| --- | --- |
| Di chuyển | `W` `A` `S` `D` hoặc phím mũi tên |
| Quan sát | Click scene, sau đó di chuyển chuột |
| Nhảy | `Space` |
| Thoát Pointer Lock | `Esc` |
| Xem hiện vật gần nhất | `F` |
| Dịch chuyển nhanh | Nút bản đồ trong tour |
| Preview hiện vật | Kéo để xoay, cuộn để zoom |

## ◆ Dữ liệu Firestore

```text
scenes
├── scene_placements ──→ scene_assets ──→ collision_models
├── teleport_points
└── interaction_points ──→ artifacts
```

Các collection runtime:

- `scenes`: môi trường, player, floor và kill plane.
- `scene_placements`: vị trí, rotation và scale của asset trong scene.
- `scene_assets`: URL GLB và custom renderer key.
- `collision_models`: model collision tối giản.
- `teleport_points`: vị trí và hướng nhìn khi dịch chuyển.
- `interaction_points`: hotspot liên kết placement với hiện vật.
- `artifacts`: model preview, camera, metadata và annotation.

Schema và sample document chi tiết nằm trong [`docs/database-design.md`](docs/database-design.md).

## ◆ Cấu trúc source

```text
src/
├── api/          # Truy vấn Firestore
├── assets/       # Ảnh, texture và tài nguyên local
├── components/   # Scene, player, preview, loading và UI dùng chung
├── hooks/        # React Query hooks
├── i18n/         # Locale EN/VI
├── pages/        # Home, map, loading và tour
├── store/        # Zustand stores
├── style/        # Theme và global styles
├── types/        # TypeScript data models
└── utils/        # Helper và scene presentation
```

## ◆ Scripts

| Lệnh | Mục đích |
| --- | --- |
| `bun run dev` | Chạy development server |
| `bun run lint` | Kiểm tra ESLint, không cho phép warning |
| `bun run lint:fix` | Tự sửa lỗi lint có thể sửa |
| `bun run prettier` | Kiểm tra format |
| `bun run build` | Type-check và build production |
| `bun run preview` | Xem thử production build |

Output production được tạo trong thư mục `dist/`.

## ◆ Tài liệu

| Tài liệu | Nội dung |
| --- | --- |
| [`system-architecture.md`](docs/system-architecture.md) | Kiến trúc hệ thống và data flow |
| [`database-design.md`](docs/database-design.md) | Collection, field và relationship |
| [`application-flows.md`](docs/application-flows.md) | Luồng map, tour và interaction |
| [`user-guide.md`](docs/user-guide.md) | Hướng dẫn sử dụng |
| [`configuration-guide.md`](docs/configuration-guide.md) | Firebase, Cloudinary, MapTiler và deploy |
| [`asset-pipeline.md`](docs/asset-pipeline.md) | Blender, GLB, compression và collision |
| [`testing-and-evaluation.md`](docs/testing-and-evaluation.md) | Test case, benchmark và giới hạn |

## ◆ Trạng thái

Project đang trong quá trình hoàn thiện cho thesis. Navigation và heritage interaction đã có luồng demo hoạt động; guided exploration, graphics presets và benchmark đa thiết bị vẫn là các hạng mục tiếp theo.

Chi tiết phạm vi hiện tại xem tại [`CURRENT_FEATURES.md`](CURRENT_FEATURES.md).

---

<div align="center">

**Heritage · Technology · Exploration**

*Preserving stories through interactive space.*

</div>
