# Design System Strategy: The Civic Editorial

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Civic Editorial."** 

Unlike traditional utility-first transit apps that feel like spreadsheets, this system treats hyperlocal transit information as a premium concierge service. It rejects the "app-in-a-box" aesthetic in favor of a sophisticated, editorial layout reminiscent of high-end wayfinding and prestige journals. 

The experience is defined by **intentional asymmetry**—offsetting serif headlines against a rigid sans-serif grid—and **tonal depth**. We break the "template" look by using generous white space (the "Breathing Room") and layered surfaces that feel like stacked sheets of fine linen paper. Every element must feel curated, not just placed.

---

## 2. Colors & Surface Logic
The palette is rooted in a warm, institutional neutral that evokes stone and parchment, providing a high-contrast base for "Ink" typography.

### Surface Hierarchy & Nesting
We abandon the flat grid. Hierarchy is achieved through **Tonal Layering**. Use the `surface-container` tiers to create nested depth:
*   **The Base:** `surface` (#fffcf7) is your canvas.
*   **The Section:** Use `surface-container-low` (#fcf9f3) for secondary content areas.
*   **The Detail:** Use `surface-container-highest` (#eae8de) for the most prominent interactive elements.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background creates a clean, sophisticated break that a line cannot replicate.

### Signature Textures & Glass
To avoid a "flat" feel, use **Glassmorphism** for floating elements (like a navigation bar or a "Live Bus" card). 
*   **The Glass Effect:** Apply `surface-container` with 85% opacity and a `20px` backdrop blur.
*   **The Subtle Gradient:** For primary CTAs, use a nearly imperceptible linear gradient from `primary` (#5f5e5e) to `primary-dim` (#535252). This adds "soul" and a tactile, pressed-ink quality.

---

## 3. Typography: The Dual-Voice System
We use a high-contrast typographic pairing to balance brand authority with operational clarity.

*   **The Brand Voice (Noto Serif):** Used for locations, headers, and storytelling. It provides the "Institutional" weight.
    *   *Display-LG (3.5rem):* Reserved for major arrivals or "Pulse" status.
    *   *Headline-MD (1.75rem):* Used for neighborhood names and station titles.
*   **The Operational Voice (Inter):** Used for all data, timings, and wayfinding.
    *   *Title-MD (1.125rem):* The standard for bus line numbers and ETA labels.
    *   *Label-SM (0.6875rem):* Used for micro-data, like "Distance" or "Last Updated."

**Editorial Note:** Always lead with the Serif to establish the "Sense of Place" before diving into the Sans-Serif "Data."

---

## 4. Elevation & Depth
In this system, elevation is a whisper, not a shout.

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-low` section to create a soft, natural lift without a shadow.
*   **Ambient Shadows:** If a floating element (like a map marker) requires a shadow, it must be an **Ambient Glow**: 
    *   *X: 0, Y: 8, Blur: 24px, Spread: 0, Color:* `on-surface` (#383831) at 4% opacity. 
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the `outline-variant` (#babab0) at 15% opacity. **Never use 100% opaque borders.**

---

## 5. Components

### Primary Buttons
*   **Style:** Pill-shaped (`rounded-full`). 
*   **Colors:** Background: `primary` (#5f5e5e); Text: `on-primary` (#faf7f6).
*   **Interaction:** On hover, shift to `primary-dim`. No heavy shadows; the color shift is the signal.

### The "Pulse" Card
*   **Usage:** The core container for transit arrival times.
*   **Constraint:** **No Dividers.** Use vertical white space (`spacing-4` / 1.4rem) to separate the Bus Line from the ETA. 
*   **Status Indicator:** Use a subtle "Pulse" animation—a soft scaling (1.0 to 1.05) of a 4px dot using `secondary` (Green) or `tertiary` (Amber).

### Input Fields
*   **Style:** Minimalist underline or tonal shift. 
*   **Active State:** The label transitions from `body-md` to `label-md` and the background shifts slightly to `surface-container-high`.

### Contextual Chips
*   **Style:** `rounded-md` (0.375rem). Use `surface-variant` for inactive and `secondary-container` for active selection.

---

## 6. Do’s and Don'ts

### Do:
*   **Embrace Asymmetry:** Align a Serif headline to the left and the Sans-Serif data to the far right, leaving a wide "void" in the middle.
*   **Use Tonal Transitions:** Shift background colors between `surface` and `surface-dim` to signal a transition from a "Search" mode to a "Results" mode.
*   **Prioritize the "Ink":** Let the `on-surface` (#383831) text do the heavy lifting for hierarchy. Use bold weights for data points (Inter) and regular weights for descriptions (Inter).

### Don't:
*   **Don't use 1px lines:** Do not separate list items with lines. Use a `spacing-2` (0.7rem) gap or a alternating background color shift (`surface` to `surface-container-low`).
*   **Don't use generic blue:** Stick strictly to the status palette. `secondary` for "On Time," `tertiary` for "Delayed," and `error` for "Cancelled."
*   **Don't crowd the edges:** Maintain a minimum margin of `spacing-6` (2rem) from the screen edge to maintain the "Editorial" feel.