# IPA Chat - Grid 3 Edition 🗣️

A minimal, ultra-compact IPA (International Phonetic Alphabet) chat application designed specifically for **Grid 3 AAC software** with tiny 1" × 5" display windows.

![IPA Chat Grid 3](https://img.shields.io/badge/Grid%203-Compatible-blue?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen?style=flat-square)

## ✨ Features

- ✅ **Ultra-compact design** - Optimized for Grid 3's 1" × 5" webview windows
- ✅ **Phoneme-to-image display** - See images appear above IPA text as you type
- ✅ **Auto-loading mappings** - No file picker needed for Grid 3 environments
- ✅ **Real-time preview** - Watch phoneme images appear instantly as you type
- ✅ **Azure TTS integration** - Optional speech synthesis with configurable voices
- ✅ **Grid 3 compatible** - Works without file system access
- ✅ **Single HTML file** - No build process, just deploy and go
- ✅ **Multiple display modes** - Text, Images, or Both (default: Both)

## 🚀 Quick Start (GitHub Pages)

This site is ready to deploy on GitHub Pages:

1. **Clone this repository**
   ```bash
   git clone https://github.com/your-username/ipa-chat-grid3.git
   cd ipa-chat-grid3
   ```

2. **Push to GitHub** (if you haven't already)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save!

4. **Access your app**
   - URL: `https://your-username.github.io/ipa-chat-grid3/`

## 💻 Local Testing

### Option 1: Python (Recommended)
```bash
cd C:/GitHub/ipa-chat-grid3
python -m http.server 8000
# Open: http://localhost:8000/minimal-ipa-chat.html
```

### Option 2: Node.js
```bash
cd C:/GitHub/ipa-chat-grid3
npx http-server -p 8000
# Open: http://localhost:8000/minimal-ipa-chat.html
```

### Option 3: PHP
```bash
cd C:/GitHub/ipa-chat-grid3
php -S localhost:8000
# Open: http://localhost:8000/minimal-ipa-chat.html
```

## 📱 Usage in Grid 3

1. **Add the webview** in Grid 3 pointing to your GitHub Pages URL
2. **Type IPA text** directly (no slashes needed): `h ə l əʊ`
3. **Watch images appear** above text as you type
4. **Press Ctrl+Enter** to add to message history
5. **Press Ctrl+Shift+Enter** to speak all messages

### Keyboard Shortcuts
- **Ctrl+Enter** - Add message to history
- **Ctrl+Shift+Enter** - Speak all messages
- **Ctrl+K** - Clear all messages
- **Ctrl+,** - Open/close settings
- **🖼️ Button** - Cycle display modes (Text → Images → Both)

## 🎯 Display Modes

Click the **🖼️** button to cycle through:

1. **🖼️ Text** - IPA text only
2. **📝 Images** - Phoneme images only
3. **🔄 Both** - Images above, small text below *(default)*

## ⚙️ Configuration

### Azure TTS (Optional)
1. Click **⚙️ Settings** button
2. Enter your Azure TTS API key and region
3. Select voice from dropdown
4. Click **Save Settings**

### Phoneme Files
The app auto-detects these files in the same directory:
- `webapp-phoneme-mapping.json` *(included)*
- Any other JSON/CSV phoneme mapping files

## 📁 Files Included

```
ipa-chat-grid3/
├── minimal-ipa-chat.html          # Main application (67KB)
├── webapp-phoneme-mapping.json    # 35 phoneme mappings
├── phonemes/                       # 38 phoneme images (200×200px)
│   ├── image_grids_start_1_1_0_text_0_jpeg.png
│   ├── image_grids_start_1_2_0_text_0_jpeg.png
│   └── ... (36 more)
└── README.md                       # This file
```

## 🔧 Customization

### Add Your Own Phonemes

Create a JSON file following this format:

```json
[
  {"ipa": "/h/", "image": "phonemes/my-h.png"},
  {"ipa": "/æ/", "image": "phonemes/my-ae.png"},
  {"ipa": "/t/", "image": "phonemes/my-t.png"}
]
```

Place it in the same directory as `minimal-ipa-chat.html` and select it from the dropdown.

### Modify Display Size

Edit the CSS variables in `minimal-ipa-chat.html`:

```css
.phoneme-with-image img {
    width: 24px;   /* Change image size */
    height: 24px;
}

.phoneme-with-image span {
    font-size: 0.4rem;  /* Change text size */
}
```

## 🌐 Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Grid 3 webview (optimized)

## 🐛 Troubleshooting

**Problem:** "Can't load phoneme files"
- **Solution:** Must use HTTP server, not `file://` protocol
- GitHub Pages provides this automatically

**Problem:** "Images don't load"
- **Solution:** Ensure `phonemes/` folder is in the same directory as the HTML file

**Problem:** "Works locally but not on GitHub Pages"
- **Solution:** Make sure all files are committed and pushed

## 📊 Technical Details

- **Framework:** Vanilla JavaScript (no dependencies)
- **File Size:** ~67KB (single HTML file)
- **Viewport:** Optimized for 400×100 pixels (Grid 3)
- **Storage:** localStorage for settings persistence
- **API:** Azure Cognitive Services (optional)

## 📝 License

This project is designed for AAC (Augmentative and Alternative Communication) use.

## 🤝 Contributing

Feel free to fork and customize for your needs!

## 📧 Support

For issues specific to Grid 3 integration, please ensure:
1. You're using HTTP/HTTPS, not file:// protocol
2. All files (HTML, JSON, phonemes/) are in the same directory
3. Your GitHub Pages repository is public or appropriately shared

---

**Made for the Grid 3 AAC community** 🗣️✨