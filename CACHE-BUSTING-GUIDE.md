# 🔄 Cache-Busting for Testing

## Quick URL Parameters to Disable Caching

While testing changes, add any of these to your URL to disable caching:

### 1. **`?nocache`** (Simple)
```
http://localhost:8000/minimal-ipa-chat.html?nocache
```

### 2. **`?dev=true`** (Development mode)
```
http://localhost:8000/minimal-ipa-chat.html?dev=true
```

### 3. **`?cachebuster=1`** (Explicit)
```
http://localhost:8000/minimal-ipa-chat.html?cachebuster=1
```

## What These Parameters Do:

✅ **Disable browser caching** - Always load fresh JavaScript
✅ **Add anti-cache meta tags** - Cache-Control, Pragma, Expires
✅ **Show visual indicator** - "🔄 No Cache" badge appears in header
✅ **Console warnings** - Reminds you that cache is disabled

## Visual Indicators:

When cache is disabled, you'll see:

1. **Header Badge**: "🔄 No Cache" appears next to "IPA Chat"
2. **Console Messages**:
   ```
   🔄 CACHE DISABLED for testing (URL parameter detected)
   🔄 Cache disabled for testing - Visual indicator shown
   ```

## Use Cases:

### 🧪 **Testing New Changes**
```bash
# When developing and testing
http://localhost:8000/minimal-ipa-chat.html?nocache
```

### 🐛 **Debugging Issues**
```bash
# When troubleshooting cache-related problems
http://localhost:8000/minimal-ipa-chat.html?dev=true
```

### 🔄 **Rapid Iteration**
```bash
# When making frequent changes and testing
http://localhost:8000/minimal-ipa-chat.html?cachebuster=1
```

## GitHub Pages Testing:

For GitHub Pages (or any hosted version):

```
https://willwade.github.io/ipa-chat-grid3/minimal-ipa-chat.html?nocache
```

## Cache-Busting Mechanism:

The script adds these meta tags when cache-busting is enabled:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

## Comparison:

| Feature | Normal Mode | Cache-Busted Mode |
|----------|-------------|-------------------|
| Browser Caching | ✅ Enabled | ❌ Disabled |
| Reload Speed | ⚡ Fast | 🐢 Slower (always fetches fresh) |
| Testing | ❌ May see old code | ✅ Always see latest code |
| Visual Indicator | ❌ None | ✅ "🔄 No Cache" badge |
| Production Ready | ✅ Yes | ❌ Testing only |

## Tips:

1. **Add to bookmarks**: Save cache-busted URL as a bookmark
2. **Browser DevTools**: Also use Ctrl+Shift+R to hard refresh
3. **GitHub Pages**: After pushing changes, add `?nocache` to see updates immediately
4. **Remove for production**: Don't use these parameters in production Grid 3 setups

## Technical Details:

### JavaScript Detection:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const noCache = urlParams.get('nocache');
const devMode = urlParams.get('dev');
const cacheBuster = urlParams.get('cachebuster');

if (noCache !== null || devMode === 'true' || cacheBuster !== null) {
    // Disable caching
}
```

### Visual Indicator:
```javascript
if (window.cacheBustingEnabled) {
    cacheIndicator.style.display = 'inline-block'; // Show "🔄 No Cache"
}
```

## Troubleshooting:

**Q**: Still seeing cached content?
**A**: Try these steps:
1. Use the cache-busting parameter: `?nocache`
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Clear browser cache manually
4. Try Incognito/Private mode

**Q**: Will this affect production users?
**A**: No, only when the URL parameter is added. Production Grid 3 setups won't have this parameter.

---

**Status**: ✅ Ready for testing
**Usage**: Add `?nocache` to your URL while developing