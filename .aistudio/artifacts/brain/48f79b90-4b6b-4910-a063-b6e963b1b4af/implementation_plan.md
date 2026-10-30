# Implementation Plan: 9:16 Mobile Smartphone Viewport Optimization

Enhance the targeted 9:16 viewport container and mobile chassis in `MobileFrameWrapper.tsx` to provide a native smartphone APK visual aesthetic and seamless scrolling experience.

## Proposed Changes

### 1. Viewport Container Styling (`src/components/MobileFrameWrapper.tsx`)
- Enhance the selected container element (`div.flex-1.overflow-y-auto`) with:
  - Deep modern background tone (`bg-stone-900`/`bg-stone-950` with subtle contrast to content cards) for an authentic APK dark mode look.
  - Seamless edge-to-edge layout with subtle inner shadow (`shadow-inner`) for depth within the phone chassis.
  - Smooth mobile momentum scrolling (`-webkit-overflow-scrolling: touch`) and clean scrollbar suppression.
  - Refined border radius alignment between the outer chassis, status bar, and bottom navigation bar.

### 2. Status Bar & Chassis Refinement
- Ensure the Android-style status bar smoothly blends into the top of the viewport.
- Maintain persistent fixed positioning of top status indicator and bottom tab bar so the inner content area scrolls naturally like a mobile app.
- Ensure all Google Workspace export modals, monetization views, and chat inputs remain perfectly bounded within the 9:16 frame.

## Verification Plan
1. **Compilation**: Run `compile_applet` to confirm no TypeScript or Vite errors.
2. **Visual Check**: Ensure the 9:16 aspect ratio smartphone container renders cleanly, child tabs scroll smoothly without clipping, and UI elements fit comfortably on all screen sizes.
