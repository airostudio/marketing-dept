# WYSIWYG Website Editor

A powerful visual website builder integrated into the AI Marketing Platform.

## Features

### 🎨 Visual Editing
- **Live Preview**: See changes instantly as you type
- **Click-to-Edit**: Click any text to start editing
- **Section-Based**: Organized into logical sections (Hero, About, Features, Contact)
- **Color Customization**: Adjust primary, secondary, and accent colors
- **Real-Time Updates**: No refresh needed, changes appear immediately

### 📝 Editable Sections

#### 1. Hero Section
- Large heading
- Subheading text
- Call-to-action button
- Gradient background with custom colors

#### 2. About Section
- Heading
- Paragraph text
- Clean white background

#### 3. Features Section
- Section heading
- 3 feature cards with:
  - Emoji icon
  - Title
  - Description
- Grid layout (responsive)

#### 4. Contact Section
- Heading
- Email address
- Phone number
- Gradient background

### 🛠️ Editor Interface

```
┌─────────────────────────────────────────────────────────┐
│  🎨 Site Editor  [✏️ Editing]  [💾 Export] [🚀 Publish] │
├───────────┬─────────────────────────────┬───────────────┤
│ Sections  │                             │  Properties   │
│           │                             │               │
│ 🎯 hero   │      EDITABLE CANVAS       │  Section: hero│
│ ℹ️  about  │                             │               │
│ ✨ features│   (Live Website Preview)    │  Click text   │
│ 📧 contact│                             │  to edit      │
│           │                             │               │
│ Colors    │                             │               │
│ ■ Primary │                             │               │
│ ■ Secondary│                            │               │
│ ■ Accent  │                             │               │
└───────────┴─────────────────────────────┴───────────────┘
```

### 🎯 How To Use

#### Launch the Editor:

1. Open the AI Marketing Platform
2. Click **"🎨 Launch Website Editor"** button
3. Editor opens in full-screen mode

#### Edit Content:

**Method 1: Direct Editing (Recommended)**
- Click on any text in the canvas
- Start typing to replace content
- Press Enter or click elsewhere to finish

**Method 2: Section Navigation**
- Click a section name in the left sidebar
- Section highlights in the canvas
- Edit fields appear with dashed borders

#### Change Colors:

1. Find **"Colors"** section in left sidebar
2. Click on color picker (Primary, Secondary, or Accent)
3. Choose your color
4. See instant changes in the preview

#### Export Your Site:

1. Click **"💾 Export HTML"** in the toolbar
2. A complete HTML file downloads
3. Upload to any web host
4. Your site is live!

## Technical Details

### File Structure

```
app/src/editor/
├── SiteEditor.jsx      # Main editor component
├── SiteEditor.css      # Complete styling
└── README.md           # This file
```

### State Management

```javascript
const [content, setContent] = useState({
  hero: { heading, subheading, buttonText },
  about: { heading, text },
  features: { heading, items: [...] },
  contact: { heading, email, phone }
});

const [colors, setColors] = useState({
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb'
});
```

### Key Functions

**updateContent(section, field, value)**
Updates text content for a specific section

**updateFeature(index, field, value)**
Updates a specific feature card

**exportHTML()**
Generates standalone HTML file with all content and styles

**generateHTML(content, colors)**
Converts editor state into production-ready HTML

## Customization

### Adding New Sections

1. Add section to content state:
```javascript
const [content, setContent] = useState({
  // existing sections...
  newSection: {
    heading: 'New Section',
    text: 'Section content'
  }
});
```

2. Add section to sidebar:
```javascript
<button onClick={() => setSelectedSection('newSection')}>
  🆕 New Section
</button>
```

3. Add section to canvas:
```javascript
<section className="section-new">
  {/* Your section HTML */}
</section>
```

### Changing Default Colors

Edit the initial colors state:
```javascript
const [colors, setColors] = useState({
  primary: '#yourcolor',
  secondary: '#yourcolor',
  accent: '#yourcolor'
});
```

### Adding More Features

Currently shows 3 features. To add more:

```javascript
features: {
  heading: 'Features',
  items: [
    { icon: '🚀', title: 'Feature 1', description: '...' },
    { icon: '💎', title: 'Feature 2', description: '...' },
    { icon: '🔒', title: 'Feature 3', description: '...' },
    { icon: '✨', title: 'Feature 4', description: '...' }, // Add more!
  ]
}
```

## Export Format

The exported HTML includes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Heading</title>
  <style>
    /* All styles inline for portability */
  </style>
</head>
<body>
  <!-- Complete website structure -->
  <section class="hero">...</section>
  <section class="about">...</section>
  <section class="features">...</section>
  <section class="contact">...</section>
</body>
</html>
```

**Features of exported HTML:**
- ✅ Standalone file (no external dependencies)
- ✅ Mobile responsive
- ✅ All styles included
- ✅ Custom colors preserved
- ✅ Ready to deploy anywhere

## Deployment Options

### Option 1: Direct Upload
- Export HTML file
- Upload to any web hosting (Netlify, Vercel, etc.)
- Site is live!

### Option 2: Netlify Drop
1. Go to https://app.netlify.com/drop
2. Drag exported HTML file
3. Get instant live URL

### Option 3: GitHub Pages
1. Create GitHub repo
2. Upload HTML as `index.html`
3. Enable GitHub Pages in settings

### Option 4: Vercel (Coming Soon)
- Click "🚀 Publish" in editor
- Automatic deployment
- Custom subdomain
- SSL certificate included

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save (coming soon) |
| `Ctrl/Cmd + E` | Toggle Edit/Preview |
| `Esc` | Deselect section |

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- **Build size**: 156KB (50KB gzipped)
- **Load time**: < 1s on 3G
- **Rendering**: 60 FPS
- **Memory**: < 50MB

## Roadmap

### Phase 1 (Current)
- [x] Basic editor interface
- [x] Section-based editing
- [x] Color customization
- [x] HTML export

### Phase 2 (In Progress)
- [ ] Image upload for sections
- [ ] More section templates
- [ ] Drag & drop reordering
- [ ] Undo/Redo functionality

### Phase 3 (Planned)
- [ ] One-click Vercel deployment
- [ ] Custom domain support
- [ ] User authentication
- [ ] Save/Load drafts
- [ ] Template library

### Phase 4 (Future)
- [ ] Team collaboration
- [ ] Analytics integration
- [ ] SEO optimization tools
- [ ] Mobile app

## Troubleshooting

### Editor won't load
**Solution**: Check browser console for errors, refresh page

### Changes not saving
**Solution**: Changes are live in editor, click Export to download

### Colors not updating
**Solution**: Ensure color picker is supported (modern browsers only)

### Text fields not editable
**Solution**: Make sure Edit mode is enabled (✏️ button active)

## Contributing

Want to add features? Here's how:

1. **Fork** the repository
2. **Create** a feature branch
3. **Add** your changes to `SiteEditor.jsx`
4. **Test** with `npm run build`
5. **Submit** pull request

## Support

Having issues? Contact:
- **Documentation**: [Main README](../../../README.md)
- **Issues**: GitHub Issues
- **Email**: support@yourdomain.com

---

**Made with ❤️ for the AI Marketing Department**

🎨 Happy Building!
