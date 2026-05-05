const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set Grid 3 viewport size
    await page.setViewportSize({ width: 400, height: 100 });

    console.log('🧪 Testing Backspace Functionality');
    console.log('===================================');

    // Monitor console
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('phoneme') || text.includes('input') || text.includes('backspace')) {
            console.log('📱', text);
        }
        if (msg.type() === 'error') {
            console.log('🚨 ERROR:', text);
        }
    });

    try {
        console.log('\n📋 Test 1: Load Page and Check Input');
        await page.goto('http://localhost:8000/minimal-ipa-chat.html?nocache');
        await page.waitForTimeout(2000);

        // Focus the input
        await page.focus('#input');
        await page.waitForTimeout(500);
        console.log('✅ Page loaded, input focused');

        console.log('\n📋 Test 2: Type Phonemes');
        // Type some IPA
        await page.keyboard.type('h ə l');
        await page.waitForTimeout(1000);

        const afterTyping = await page.$eval('#input', el => el.value);
        console.log('Input after typing:', afterTyping);

        // Check if phonemes appeared
        const previewAfterTyping = await page.$eval('#phoneme-preview-main', el => el.innerHTML);
        const imageCount = (previewAfterTyping.match(/<img/g) || []).length;
        console.log('Phoneme images after typing:', imageCount);

        if (imageCount >= 3) {
            console.log('✅ Phonemes appeared correctly');
        } else {
            console.log('❌ Expected 3+ phonemes, got:', imageCount);
        }

        console.log('\n📋 Test 3: Test Backspace (Delete Last IPA)');
        // Press backspace 3 times (should delete 'l', 'ə', 'h')
        for (let i = 0; i < 3; i++) {
            await page.keyboard.press('Backspace');
            await page.waitForTimeout(500);

            const currentInput = await page.$eval('#input', el => el.value);
            const currentPreview = await page.$eval('#phoneme-preview-main', el => el.innerHTML);
            const currentImageCount = (currentPreview.match(/<img/g) || []).length;

            console.log(`Backspace ${i+1}: Input="${currentInput}", Images=${currentImageCount}`);
        }

        const finalInput = await page.$eval('#input', el => el.value);
        const finalPreview = await page.$eval('#phoneme-preview-main', el => el.innerHTML);
        const finalImageCount = (finalPreview.match(/<img/g) || []).length;

        console.log('Final input:', finalInput);
        console.log('Final image count:', finalImageCount);

        if (finalInput === '' && finalImageCount === 0) {
            console.log('✅ SUCCESS: Backspace correctly deleted all phonemes');
        } else {
            console.log('❌ FAILED: Expected empty input, got:', finalInput);
        }

        console.log('\n📋 Test 4: Type and Delete Partially');
        // Type more phonemes
        await page.keyboard.type('h ə l əʊ');
        await page.waitForTimeout(1000);

        const beforePartialDelete = await page.$eval('#input', el => el.value);
        console.log('Before partial delete:', beforePartialDelete);

        // Delete just the last phoneme (əʊ)
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(1000);

        const afterPartialDelete = await page.$eval('#input', el => el.value);
        const afterPartialPreview = await page.$eval('#phoneme-preview-main', el => el.innerHTML);
        const partialImageCount = (afterPartialPreview.match(/<img/g) || []).length;

        console.log('After partial delete:', afterPartialDelete);
        console.log('Remaining phoneme count:', partialImageCount);

        if (afterPartialDelete === 'h ə l' && partialImageCount === 3) {
            console.log('✅ SUCCESS: Partial deletion works correctly');
        } else {
            console.log('❌ FAILED: Expected "h ə l", got:', afterPartialDelete);
        }

        console.log('\n📋 Test 5: Continuous Typing and Deleting');
        // Simulate typical AAC user behavior: type some, delete some, type more
        await page.keyboard.type('h');
        await page.waitForTimeout(200);
        await page.keyboard.type(' ');
        await page.waitForTimeout(200);
        await page.keyboard.type('æ');
        await page.waitForTimeout(200);
        await page.keyboard.press('Backspace'); // Delete æ
        await page.waitForTimeout(200);
        await page.keyboard.type('t');
        await page.waitForTimeout(1000);

        const finalTestInput = await page.$eval('#input', el => el.value);
        const finalTestPreview = await page.$eval('#phoneme-preview-main', el => el.innerHTML);
        const finalTestImageCount = (finalTestPreview.match(/<img/g) || []).length;

        console.log('Final test input:', finalTestInput);
        console.log('Final test images:', finalTestImageCount);

        if (finalTestInput === 'h t' && finalTestImageCount === 2) {
            console.log('✅ SUCCESS: Continuous typing/deleting works');
        } else {
            console.log('❌ FAILED: Expected "h t", got:', finalTestInput);
        }

        console.log('\n📸 Taking screenshot...');
        await page.screenshot({ path: 'test-screenshots/backspace-test.png', fullPage: true });
        console.log('✅ Screenshot saved');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }

    console.log('\n🏁 Backspace Test Complete');
    console.log('============================');
    console.log('📋 Summary:');
    console.log('  • Backspace should delete last IPA character');
    console.log('  • Phoneme preview should update immediately');
    console.log('  • Works with single and multiple deletions');
    console.log('  • Essential for AAC users to correct mistakes');
})();