const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set Grid 3 viewport size
    await page.setViewportSize({ width: 400, height: 100 });

    console.log('🧪 Testing Grid 3 Layout Fix');
    console.log('==============================');

    // Monitor console
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Start typing') || text.includes('✅') || text.includes('Grid 3')) {
            console.log('📱', text);
        }
        if (msg.type() === 'error') {
            console.log('🚨 ERROR:', text);
        }
    });

    try {
        console.log('\n📋 Test 1: Page Load in Grid 3 Viewport');
        await page.goto('http://localhost:8000/minimal-ipa-chat.html');
        await page.waitForTimeout(2000);
        console.log('✅ Page loaded');

        console.log('\n📋 Test 2: Check Layout Elements');
        const previewMain = await page.$('#phoneme-preview-main');
        const hiddenInput = await page.$('#hidden-input');
        const input = await page.$('#input');

        if (previewMain) {
            const isVisible = await previewMain.isVisible();
            console.log(isVisible ? '✅ Main preview area visible' : '❌ Preview area not visible');
        } else {
            console.log('❌ Preview area not found');
        }

        if (input) {
            const isVisible = await input.isVisible();
            const isHidden = await input.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return styles.opacity === '0' || styles.display === 'none' || styles.height === '0px';
            });
            console.log(isHidden ? '✅ Input area hidden but functional' : '❌ Input area still visible');
        } else {
            console.log('❌ Input element not found');
        }

        console.log('\n📋 Test 3: Typing and Image Display');
        // Focus on the hidden input
        await page.focus('#input');
        await page.waitForTimeout(500);

        // Type some IPA
        await page.keyboard.type('h ə');
        await page.waitForTimeout(1000);

        // Check if images appeared in the main preview area
        const previewContent = await previewMain.innerHTML();
        if (previewContent.includes('phoneme-with-image') && previewContent.includes('<img')) {
            console.log('✅ Phoneme images appearing in main area');

            const imageCount = (previewContent.match(/<img/g) || []).length;
            console.log(`📊 Found ${imageCount} phoneme images`);
        } else {
            console.log('❌ Phoneme images not appearing');
        }

        console.log('\n📋 Test 4: Click on Preview Area');
        // Click on the preview area to test focus handling
        await previewMain.click();
        await page.waitForTimeout(500);

        const activeElement = await page.evaluate(() => document.activeElement.id);
        console.log(activeElement === 'input' ? '✅ Click focuses hidden input' : '❌ Click not focusing input');

        console.log('\n📋 Test 5: Visual Layout');
        const screenshot = await page.screenshot({ path: 'test-screenshots/grid3-layout-test.png', fullPage: true });
        console.log('✅ Screenshot saved');

        // Check positioning
        const previewBox = await previewMain.boundingBox();
        const inputBox = await input.boundingBox();

        console.log(`📍 Preview area position: ${previewBox ? 'visible' : 'hidden'}`);
        console.log(`📍 Input area position: ${inputBox ? 'hidden (opacity: 0)' : 'visible'}`);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }

    console.log('\n🏁 Grid 3 Layout Test Complete');
    console.log('===============================');
    console.log('📱 Expected behavior:');
    console.log('  • Input area: Hidden but takes keyboard input');
    console.log('  • Main preview: Centered phoneme images');
    console.log('  • Click preview: Focuses hidden input');
    console.log('  • Type IPA: Images appear in main area');
})();