# Fonts Documentation

## Newly added font pack
Source: inbound zip (`c9c6fb8d-15bd-4c2e-a1d8-1edfb096d251.zip`)

### Installed files
Location: `src/Assets/Fonts/NeueMontreal/`
- `NeueMontreal-Light.otf` (300)
- `NeueMontreal-Regular.otf` (400)
- `NeueMontreal-Medium.otf` (500)
- `NeueMontreal-Bold.otf` (700)
- `NeueMontreal-LightItalic.otf` (300 italic)
- `NeueMontreal-Italic.otf` (400 italic)
- `NeueMontreal-MediumItalic.otf` (500 italic)
- `NeueMontreal-BoldItalic.otf` (700 italic)

## CSS registration
Registered globally in: `src/index.css`

Family name used:
- `font-family: NeueMontreal`

## How to use
```css
.selector {
  font-family: NeueMontreal;
  font-weight: 400; /* 300, 400, 500, 700 available */
  font-style: normal; /* or italic */
}
```

## Notes
- Fonts are registered and available, but no active component-level overrides are currently applied.
- Existing default global font remains unchanged unless explicitly set to `NeueMontreal` in selectors.
