const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set Grid 3 viewport size
    await page.setViewportSize({ width: 400, height: 100 });

    console.log('🧪 Testing AAC Accessibility Features');
    console.log('=====================================');

    // Monitor console
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Babble') || text.includes('partial') || text.includes('Spoke') || text.includes('👶') || text.includes('🔄')) {
            console.log('📱', text);
        }
        if (msg.type() === 'error') {
            console.log('🚨 ERROR:', text);
        }
    });

    try {
        console.log('\n📋 Test 1: Page Load');
        await page.goto('http://localhost:8000/minimal-ipa-chat.html');
        await page.waitForTimeout(2000);
        console.log('✅ Page loaded');

        console.log('\n📋 Test 2: Check New Buttons');
        const babbleBtn = await page.$('#babble-mode-btn');
        const partialBtn = await page.$('#partial-word-btn');
        const speakInputBtn = await page.$('#speak-input-btn');

        if (babbleBtn && partialBtn && speakInputBtn) {
            console.log('✅ All new AAC buttons present');
        } else {
            console.log('❌ Some buttons missing');
        }

        console.log('\n📋 Test 3: Babble Mode Toggle');
        if (babbleBtn) {
            await babbleBtn.click();
            await page.waitForTimeout(500);

            const isActive = await babbleBtn.evaluate(el => el.classList.contains('active'));
            if (isActive) {
                console.log('✅ Babble mode activates correctly');
            } else {
                console.log('❌ Babble mode not activating');
            }

            // Turn it off
            await babbleBtn.click();
            await page.waitForTimeout(500);
        }

        console.log('\n📋 Test 4: Speak Partial Word Toggle');
        if (partialBtn) {
            await partialBtn.click();
            await page.waitForTimeout(500);

            const isActive = await partialBtn.evaluate(el => el.classList.contains('active'));
            if (isActive) {
                console.log('✅ Speak partial word mode activates correctly');
            } else {
                console.log('❌ Speak partial word mode not activating');
            }

            // Turn it off
            await partialBtn.click();
            await page.waitForTimeout(500);
        }

        console.log('\n📋 Test 5: Speak Current Input');
        const inputField = await page.$('#input');
        if (inputField && speakInputBtn) {
            await inputField.fill('h ə');
            await page.waitForTimeout(500);

            // Click speak button
            await speakInputBtn.click();
            await page.waitForTimeout(1000);
            console.log('✅ Speak input button clicked');
        }

        console.log('\n📋 Test 6: Keyboard Shortcuts');
        // Test Ctrl+B for babble mode
        await page.keyboard.press('Control+b');
        await page.waitForTimeout(500);

        const babbleActive = await babbleBtn.evaluate(el => el.classList.contains('active'));
        if (babbleActive) {
            console.log('✅ Ctrl+B toggles babble mode');
        } else {
            console.log('❌ Ctrl+B not working');
        }

        // Test Ctrl+P for partial word mode
        await page.keyboard.press('Control+p');
        await page.waitForTimeout(500);

        const partialActive = await partialBtn.evaluate(el => el.classList.contains('active'));
        if (partialActive) {
            console.log('✅ Ctrl+P toggles speak partial words');
        } else {
            console.log('❌ Ctrl+P not working');
        }

        console.log('\n📋 Test 7: Visual Layout');
        await page.screenshot({ path: 'test-screenshots/aac-features-test.png', fullPage: true });
        console.log('✅ Screenshot saved');

        console.log('\n📋 Feature Summary:');
        console.log('  👶 Babble Mode: Speak & delete each phoneme');
        console.log('  🔄 Speak Partial: Speak accumulated text');
        console.log('  🎤 Speak Input: Speak current content');
        console.log('  ⌨️  Shortcuts: Ctrl+B, Ctrl+P');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }

    console.log('\n🏁 AAC Features Test Complete');
    console.log('=================================');
})();