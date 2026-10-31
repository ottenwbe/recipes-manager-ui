# Feature Plan: Add RM Stylized Logo and Favicon

## Overview
Add a stylized "RM" (Recipes Manager) logo and favicon to the application for better branding and visual identity.

## Feature Branch
`feature/add-rm-logo-favicon`

## Goals
- Replace default Vite favicon with custom RM logo
- Add RM logo to the application header/navigation
- Ensure logo is responsive and looks good on all devices
- Maintain existing color scheme and styling

## Implementation Plan

### 1. Assets Creation
- [ ] Create `public/favicon.ico` - RM stylized favicon (16x16, 32x32, 48x48)
- [ ] Create `src/assets/logo.svg` - RM stylized logo in SVG format
- [ ] Create `src/assets/logo.png` - RM logo in PNG format (fallback)

### 2. Favicon Integration
- [ ] Replace default Vite favicon in `index.html`
- [ ] Update `index.html` to reference new favicon
- [ ] Add proper meta tags for favicon (different sizes for different devices)

### 3. Logo Integration
- [ ] Add logo to `App.tsx` or `PageHeader` component
- [ ] Style logo to match existing theme (primary color: #2196f3)
- [ ] Ensure logo is responsive (scales on mobile/desktop)
- [ ] Add alt text for accessibility

### 4. Styling
- [ ] Add CSS for logo sizing and positioning
- [ ] Ensure logo doesn't break existing layout
- [ ] Test logo appearance in light/dark modes (if applicable)

### 5. Testing
- [ ] Verify favicon appears in browser tab
- [ ] Verify logo renders correctly in header
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Check accessibility (alt text, contrast)

## File Changes Expected

```
public/
  favicon.ico (new)
  
src/assets/
  logo.svg (new)
  logo.png (new)
  
src/index.html (modified)
src/common/components/App.tsx or PageHeader.tsx (modified)
src/styles/App.css or component CSS (modified)
```

## Design Guidelines

### Logo Design
- Simple "RM" monogram
- Clean, modern style
- Color: #2196f3 (primary blue) or white on blue background
- Should work at small sizes (16x16 for favicon)
- SVG format preferred for scalability

### Favicon
- Should be recognizable at 16x16
- Can be simplified version of logo
- ICO format for maximum browser compatibility

## Acceptance Criteria
- [ ] Favicon displays in browser tab
- [ ] Logo displays in application header
- [ ] Logo is visible and legible on all screen sizes
- [ ] Logo matches application color scheme
- [ ] No layout issues introduced
- [ ] All existing tests still pass
- [ ] Build completes successfully

## Notes
- Keep the design simple and professional
- Consider using a design tool or online favicon generator
- SVG is preferred for logos as it scales perfectly
- Test favicon in multiple browsers (Chrome, Firefox, Safari, Edge)

## Resources
- Online favicon generators:
  - https://favicon.io/
  - https://realfavicongenerator.net/
  - https://favicon.cc/
- SVG logo creation tools:
  - https://editor.method.ac/
  - https://boxy-svg.com/
