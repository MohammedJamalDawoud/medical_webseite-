# Design System

## Colors

### Primary Palette
- **Primary**: `#0f766e` (Teal 700) - Used for primary buttons, active states, and key accents.
- **Secondary**: `#0d9488` (Teal 600) - Used for hover states and secondary accents.
- **Accent**: `#f59e0b` (Amber 500) - Used for warnings or highlights.

### Backgrounds
- **Light Mode**:
  - `bg-gray-50`: Main background.
  - `bg-white`: Card background.
- **Dark Mode**:
  - `bg-gray-900`: Main background.
  - `bg-gray-800`: Card background.

### Glassmorphism
- Used in Navbar and Cards.
- `backdrop-filter: blur(12px)`
- `background: rgba(255, 255, 255, 0.7)` (Light) / `rgba(17, 24, 39, 0.7)` (Dark)

## Typography

- **Font Family**: System UI / Sans-serif (Inter equivalent).
- **Headings**: Bold, Gray-900 (Light) / White (Dark).
- **Body**: Regular, Gray-600 (Light) / Gray-300 (Dark).

## Components

### Buttons
- **Primary**: Teal background, white text, rounded corners.
- **Ghost**: Transparent background, hover effect.

### Cards
- White/Gray-800 background.
- Shadow-sm or Shadow-md.
- Rounded-lg or Rounded-xl.

### Feedback
- **Skeleton**: Loading placeholder with pulse animation.
- **Spinner**: Rotating loader for async actions.
- **Alerts**: Color-coded banners for success/error messages.

## Accessibility
- All interactive elements have `aria-label` or visible labels.
- Focus states are clearly visible.
- Color contrast meets WCAG AA standards.
