# Standardized Reusable UI Interactions Specification

This document details the standardized reusable UI interaction components developed for the Titan email client prototype. These components isolate structural layouts and core animation states into base classes, utilizing CSS variables and modifier classes for visual configurations.

---

## 1. Reusable Action Icon Button Component (`.titan-action-btn`)

### Purpose
Provides a standard, highly interactive wrapper for toolbar, control panel, and header icon buttons. It encapsulates hover scaling animations, transition properties, and theme variables.

### HTML Structure
Action buttons should be structured with the base class `.titan-action-btn` combined with an optional color modifier class:
```html
<button class="titan-action-btn action-btn-reminder" title="Reminder">
  <svg class="ci-reminder" preserveAspectRatio="none" viewBox="0 0 32 32">
    <!-- SVG Paths -->
  </svg>
</button>
```

### CSS Specifications
```css
/* Reusable Action Icon Button Base */
.titan-action-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px; cursor: pointer; border: none; background: none;
  flex-shrink: 0; padding: 0;
  transition: transform 0.15s ease, background 0.15s ease;
}

/* Hover Interaction Pop & Background highlight */
.titan-action-btn:hover {
  background: var(--btn-hover-bg, #f0f2f5);
  transform: scale(1.1);
}

/* Core SVG child transitions */
.titan-action-btn svg {
  display: block;
}
.titan-action-btn svg path {
  transition: fill 0.2s ease, stroke 0.2s ease;
}

/* Hover SVG Color Transition */
.titan-action-btn:hover svg path {
  fill: var(--btn-hover-fill);
  stroke: var(--btn-hover-stroke);
}
```

### Modifier Classes (Hover Colors)
Modifiers dynamically supply values to the base component's CSS variables:
* **Reminder:** `.action-btn-reminder { --btn-hover-fill: #c084fc; }` (Pastel purple)
* **Text Styling:** `.action-btn-text { --btn-hover-fill: #60a5fa; }` (Pastel blue)
* **Attachment:** `.action-btn-attach { --btn-hover-fill: #fb923c; }` (Pastel orange)
* **Drive:** `.action-btn-drive { --btn-hover-fill: #34a853; }` (Standard Google Drive Green)
* **Image:** `.action-btn-image { --btn-hover-fill: #e05353; }` (Soft red/coral, optimized for light background contrast)
* **Emoji:** `.action-btn-emoji { --btn-hover-fill: #ffa000; }` (Orangish yellow)
* **Signature:** `.action-btn-signature { --btn-hover-fill: #f472b6; }` (Pastel pink)
* **Bookings:** `.action-btn-bookings { --btn-hover-fill: #3ec1d3; }` (Turquoise)
* **HTML:** `.action-btn-html { --btn-hover-fill: #2dd4bf; --btn-hover-stroke: #2dd4bf; }` (Teal)
* **Campaign (Megaphone):** `.action-btn-campaign { --btn-hover-fill: #5c53db; --btn-hover-bg: #edeefd; }` (Purple-indigo with light purple background)

---

## 2. Reusable Split Action Button Component (`.titan-split-btn`)

### Purpose
Splits action buttons (such as **Compose** and **Send**) into separate main action and dropdown trigger areas, applying localized hover highlights, tactile scale clicks, and click-release ripples.

### HTML Structure
```html
<button class="titan-split-btn compose-btn">
  <span class="split-btn-main">
    <span class="btn-content-wrapper">Primary Action</span>
  </span>
  <span class="split-btn-dd">
    <span class="btn-content-wrapper">
      <img src="caret.svg" alt="">
    </span>
  </span>
</button>
```

### CSS Specifications
```css
/* Split button container */
.titan-split-btn {
  display: inline-flex; align-items: center;
  border-radius: 4px; border: none; background: #2170f4;
  cursor: pointer; padding: 0; position: relative; overflow: visible;
}

/* Left portion (Main action) */
.split-btn-main {
  height: 100%; display: flex; align-items: center;
  border-top-left-radius: 4px; border-bottom-left-radius: 4px;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}
.split-btn-main:hover {
  background: rgba(255, 255, 255, 0.12); /* White hover highlight overlay */
}
.split-btn-main:active {
  background: rgba(0, 0, 0, 0.15); /* Black click overlay */
}

/* Right portion (Dropdown trigger) */
.split-btn-dd {
  height: 100%; display: flex; align-items: center; justify-content: center;
  border-left: 1.5px solid rgba(255, 255, 255, 0.35); /* Separator line */
  border-top-right-radius: 4px; border-bottom-right-radius: 4px;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}
.split-btn-dd:hover {
  background: rgba(255, 255, 255, 0.12);
}
.split-btn-dd:active {
  background: rgba(0, 0, 0, 0.15);
}

/* Tactile content click-down wrapper */
.btn-content-wrapper {
  display: inline-flex; align-items: center; justify-content: center; gap: inherit;
  transition: transform 0.1s ease;
}
.split-btn-main:active .btn-content-wrapper,
.split-btn-dd:active .btn-content-wrapper {
  transform: scale(0.98); /* 2% scale down on click */
}

/* Click-release border-ripple animation */
@keyframes border-ripple {
  0% { box-shadow: 0 0 0 0px rgba(33, 112, 244, 0.6); }
  100% { box-shadow: 0 0 0 6px rgba(33, 112, 244, 0); }
}
.split-btn-main.ripple-active,
.split-btn-dd.ripple-active {
  animation: border-ripple 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
```

### JavaScript Interactions (Event Handlers)
```javascript
// Generic event handlers for split button ripples
document.querySelectorAll('.split-btn-main, .split-btn-dd').forEach(part => {
  part.addEventListener('click', () => {
    part.classList.remove('ripple-active');
    void part.offsetWidth; // Force a reflow to restart animation on repeat clicks
    part.classList.add('ripple-active');
  });
  part.addEventListener('animationend', (e) => {
    if (e.animationName === 'border-ripple') {
      part.classList.remove('ripple-active');
    }
  });
});
```

---

## 3. Toolbar Icon Component Override (`.toolbar-icon`)

### Purpose
Applies standard action icon properties to header toolbar buttons (such as the top-right Settings/Cog and View details/Eye icons), rendering their hover highlights as rounded rectangles.

### HTML Structure
```html
<div class="toolbar-icon titan-action-btn" title="Settings">
  <img src="settings.svg" alt="">
</div>
```

### CSS Specifications
```css
/* Standardized Toolbar Icon Dimensions */
.toolbar-icon {
  width: 40px !important;
  height: 40px !important;
  /* Inherits standard rounded-rectangle border-radius: 4px; from .titan-action-btn */
}

/* Core transition for nested images */
.toolbar-icon img {
  max-width: 20px; max-height: 20px;
  width: auto; height: auto;
  transition: filter 0.2s ease;
}

/* Darkens image outline on hover instead of color shift */
.toolbar-icon:hover img {
  filter: brightness(0.6);
}
```

---

## 4. Generalizing Interactions for Design Components

When building or updating interactive components across the application, follow these high-level guidelines to ensure a consistent, premium feel. 

### 1. The "Spring Expansion" Hover State
**Best for:** Standalone interactive triggers (like the App Switcher button, grid icons, or standalone control icons).
*   **What happens on hover**: The element's background container expands slightly (e.g., `scale(1.05)`) and brightens to clearly indicate interactivity.
*   **Content Isolation**: The content inside the container (icons, text) should **not** scale up to avoid distortion. Achieve this by applying the scale transformation and background color to a pseudo-element (`::before`), keeping the content stable on top.
*   **Easing**: Use a spring-like cubic bezier curve (e.g., `cubic-bezier(0.34, 1.56, 0.64, 1)`) for a bouncy, satisfying pop.
*   **Code Reference**: Look for `.tab-switch` and its `::before` pseudo-element in `index.html` for a working implementation.

### 2. The "Tactile Snap" Click State
**Best for:** Any clickable button or trigger to provide immediate physical feedback.
*   **What happens on click (`:active`)**: The entire element (container and its contents) instantly scales down slightly (e.g., `scale(0.95)`).
*   **Easing**: The transition should be extremely fast and linear (e.g., `transition: transform 0.1s ease`) so it feels instantly responsive to the mouse press.
*   **Release**: When the click is released, it smoothly springs back to its normal or hovered state.
*   **Code Reference**: Look for `.tab-switch:active` or `.btn-content-wrapper` in `index.html`.

### 3. Disabling Hover on Active States
**Best for:** Triggers that open persistent menus, popovers, or dropdowns.
*   **What happens when open**: Once the trigger is clicked and its corresponding menu is open (typically indicated by adding an `.active` class to the trigger), its hover effects should be disabled.
*   **Implementation**: Use CSS selectors like `:not(.active):hover` so the element returns to a quiet resting state while its menu is open. This reduces visual noise while the user interacts with the menu contents.
*   **Code Reference**: Look for `.tab-switch:not(.active):hover` in `index.html`.

### 4. Ripple Effects
**Best for:** Primary actions, split buttons, or prominent call-to-action buttons (like Compose).
*   **What happens on click-release**: A subtle, expanding border or shadow ripples outward from the button and fades away.
*   **Implementation**: Triggered via JavaScript by adding a temporary `.ripple-active` class that animates a `box-shadow` expanding from `0px` to `6px` with zero opacity.
*   **Code Reference**: Look for `.ripple-active` and `@keyframes border-ripple` in `index.html`.

### 5. Pure CSS State-Driven Thread Stack

**Best for:** Collapsed groups, message thread stacks, or visual card piles.
*   **Collapsed Overlap**: In the collapsed state (`.thread-stack:not(.expanded)`), cards are forced to overlap using large negative bottom margins (e.g., `margin-bottom: -50px;`). This pulls subsequent cards up, creating a layered stack of borders.
*   **Front Card Visibility**: The front-most card (`card-1`) displays its actual content. The inner content of the background cards (`opacity: 0`) is hidden.
*   **Max Render Constraint**: The stack explicitly renders a fixed number of physical cards (e.g., 5 cards max) to act as a proxy representation, avoiding overwhelming the DOM even if there are 100+ collapsed messages.
*   **Floating Indicator Pill**: An absolute positioned pill (`.stack-pill`) is perfectly centered vertically over the layered border section to indicate the total number of hidden messages. It disappears when the stack expands.
*   **Expansion**: Clicking toggles the `.expanded` class on the container. The CSS natively handles the transition by resetting the negative overlap margins to standard list spacing (e.g., `margin-bottom: 8px;`), causing the existing cards to slide out smoothly into the natural thread flow without element swapping.
*   **Code Reference**: Look for `.thread-stack`, `.stack-card`, and `.stack-pill` in `index.html`.

### 6. Smart Persistence Tooltips

**Best for:** Dense icon bars, formatting toolbars, and composer actions.
*   **Native Tooltip Suppression**: Upon initialization, the JS script moves the `title` attribute contents to a custom `data-tooltip` attribute to prevent the browser's default OS tooltip from rendering simultaneously.
*   **Smooth Gliding**: As the user mouses across adjacent icons within the same container row, the tooltip slides fluidly on the X-axis (`transition: transform 0.2s cubic-bezier(...)`).
*   **Row-Aware Teleportation**: The script detects which row/container the hovered icon belongs to. If the user moves the cursor between disparate container rows (e.g. from a top format bar to a bottom send bar), the tooltip instantly teleports (`no-slide` class temporarily applied) bypassing the slide animation, preventing visual glitching across disjointed vertical distances.
*   **Hover Persistence**: A `150ms` delay timeout is applied on `mouseleave`. If the user accidentally drifts their mouse off the icon by a few pixels, the tooltip persists and won't flash or disappear instantly.
*   **Code Reference**: Look for the self-executing tooltip function `(function() { const tooltip = document.querySelector('.custom-tooltip'); ...` in `index.html` JS.

### 7. Selection Toggles and Dropdown Containers

**Best for:** Option toggles (like Track, Design, etc.) and formatting dropdown menus (font family, font size).

*   **Selection Toggle (Active State):**
    *   **Set/Active Representation:** Once toggled on or selected, the button maintains a persistent background container fill of `#eaeaea` (the standard hover grey) to reflect that it is set.
    *   **Hover on Active:** Hovering on an active button does **not** darken the background container further; it remains `#eaeaea` and simply scales up by 5% (`scale(1.05)`) with spring easing.
    *   **Toggle Off:** Toggling the state off completely removes the background container fill and returns the inner icon/label to its default resting state (grayed out).
*   **Dropdown Container (Pills):**
    *   **Hover Scaling:** The dropdown container pill itself transitions to `#eaeaea` background and scales up (`scale(1.05)`) on hover.
    *   **Content Isolation:** The text label and dropdown caret arrow inside the pill must **not** scale or stretch during hover, preserving visual proportions and readability.
    *   **Tactile Snap Click Feedback:** Clicking either selection toggles or dropdowns triggers the standard spring scale-down click bounce (`scale(0.97)`) to provide immediate physical feedback before opening a menu or toggling a state.


