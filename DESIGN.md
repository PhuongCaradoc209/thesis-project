# Design System: 3D Artifact Review Screen

This document outlines the design language, color palette, and typography extracted from the **3D Artifact Review Screen** project. The design is built on a "Digital Darkroom" aesthetic, optimized for high-fidelity 3D asset viewing.

## 🎨 Color Palette

The color system uses deep charcoals and blacks to ensure 3D textures and lighting are viewed without color contamination.

### Core Colors
| Token | Hex | Role |
| :--- | :--- | :--- |
| **Primary** | `#98cbff` | Active navigation, primary actions |
| **Secondary** | `#ffdb9d` | Critical alerts, active status lamps |
| **Surface** | `#131313` | Main background surface |
| **Background** | `#131313` | Root background color |

### Surface Hierarchy
Avoid 1px borders; use these tonal shifts for separation.
- **Surface Container Lowest:** `#0e0e0e` (Used for the 3D viewport)
- **Surface Container Low:** `#1c1b1b` (Used for sidebars)
- **Surface Container:** `#201f1f`
- **Surface Container High:** `#2a2a2a` (Used for property panels)
- **Surface Container Highest:** `#353534` (Used for input fields)

### Functional & Interaction
- **Outline:** `#8b90a0`
- **Error:** `#ffb4ab`
- **Surface Variant:** `#353534` (Used for floating HUDs with blur)
- **On Surface:** `#e5e2e1` (Text color for maximum readability)

---

## 🔡 Typography

The system balances technical precision (Manrope) with modern editorial legibility (Inter).

| Category | Font Family | Usage |
| :--- | :--- | :--- |
| **Headlines** | `Manrope` | Display, titles, Poly Count, technical data |
| **Body** | `Inter` | Descriptions, labels, functional UI |
| **Labels** | `Inter` | Buttons, navigation items, tooltips |

### Type Hierarchy Strategy
- **Technical Editorial:** Use `Manrope` for display-lg through headline-sm to feel "engineered".
- **Legibility:** Use `Inter` for body-md and label-sm for high x-height in dense property panels.

---

## 🛠️ Design Principles (Digital Darkroom)

### 1. The "No-Line" Rule
Strictly prohibit 1px solid borders for layout sectioning. Separation must be achieved by shifting between surface tonal tokens (e.g., `surface` to `surface_container_low`).

### 2. Glass & Gradients
- **HUDs:** Use `surface_variant` at 60% opacity with a `backdrop-filter: blur(12px-20px)`.
- **CTAs:** Apply a subtle linear gradient from `primary` to `primary_container` at 135° for a metallic, "electric" feel.

### 3. Tonal Layering
Avoid shadows on static panels. Create "milled" depth by nesting containers:
`Background (surface)` -> `Sidebar (low)` -> `Nested Card (lowest)`.

### 4. Precision Components
- **Buttons:** MD roundedness (0.375rem).
- **Input Fields:** Use `surface_container_highest` background with no bottom line. Focus is indicated by a "Ghost Border" of `primary` at 40% opacity.
