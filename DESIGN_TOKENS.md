# Design Tokens - Green & White Theme

## Color Palette

### Primary Colors

- **Primary Green**: `#0f9d58` - Main brand color for buttons, links, and primary actions
- **Accent Green**: `#1fbf6b` - Secondary brand color for highlights and secondary actions
- **Soft Green**: `#e6f8ef` - Light background color for cards, hover states, and selections

### Neutral Colors

- **Background**: `#ffffff` - Main page background
- **Muted**: `#f8f9fa` - Subtle background for sections and cards
- **Border**: `#e5e7eb` - Light borders for dividers and form elements

### Text Colors

- **Foreground**: `#171717` - Primary text color (dark on white)
- **Muted Foreground**: `#6b7280` - Secondary text for captions and descriptions

### Interactive Elements

- **Input**: `#ffffff` - Form input backgrounds
- **Ring**: `#0f9d58` - Focus ring color for accessibility

## CSS Variables

All colors are available as CSS custom properties:

```css
:root {
  --primary: #0f9d58;
  --accent: #1fbf6b;
  --soft-green: #e6f8ef;
  --bg: #ffffff;
  --muted: #f8f9fa;
  --foreground: #171717;
  --muted-foreground: #6b7280;
  --border: #e5e7eb;
  --input: #ffffff;
  --ring: #0f9d58;
}
```

## Tailwind Usage

The theme is configured in `globals.css` using Tailwind's `@theme inline` directive. You can use these colors with Tailwind classes:

- `bg-primary` - Primary green background
- `text-accent` - Accent green text
- `bg-soft-green` - Soft green background
- `border-border` - Border color
- `text-muted-foreground` - Muted text color

## Design Principles

1. **Accessibility First**: Dark text on white backgrounds for maximum readability
2. **Consistent Hierarchy**: Use primary green for main actions, accent green for secondary actions
3. **Subtle Interactions**: Soft green for hover states and selections
4. **Clean Borders**: Light gray borders for subtle separation

## Usage Examples

```jsx
// Primary button
<button className="bg-primary text-white px-4 py-2 rounded">
  Primary Action
</button>

// Secondary button
<button className="bg-accent text-white px-4 py-2 rounded">
  Secondary Action
</button>

// Card with soft background
<div className="bg-soft-green p-6 rounded-lg border border-border">
  Content
</div>

// Muted text
<p className="text-muted-foreground">
  Secondary information
</p>
```
