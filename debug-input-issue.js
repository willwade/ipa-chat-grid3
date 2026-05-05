const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set Grid 3 viewport size
    await page.setViewportSize({ width: 400, height: 100 });

    console.log('🔍 Debugging Input Issue');
    console.log('=======================');

    // Monitor all events and console
    page.on('console', msg => {
        console.log('🖥️ Browser:', msg.type().toUpperCase(), '-', msg.text());
    });

    page.on('pageerror', error => {
        console.log('🚨 PAGE ERROR:', error.message);
    });

    try {
        console.log('\n📋 Step 1: Load Page');
        await page.goto('http://localhost:8000/minimal-ipa-chat.html');
        await page.waitForTimeout(3000);

        console.log('\n📋 Step 2: Check Input Element');
        const inputExists = await page.$('#input') !== null;
        console.log('Input element exists:', inputExists);

        if (inputExists) {
            const inputData = await page.evaluate(() => {
                const input = document.getElementById('input');
                const styles = window.getComputedStyle(input);
                return {
                    id: input.id,
                    type: input.type,
                    value: input.value,
                    disabled: input.disabled,
                    readOnly: input.readOnly,
                    display: styles.display,
                    visibility: styles.visibility,
                    opacity: styles.opacity,
                    height: styles.height,
                    width: styles.width,
                    pointerEvents: styles.pointerEvents,
                    position: styles.position,
                    zIndex: styles.zIndex
                };
            });
            console.log('Input element data:', JSON.stringify(inputData, null, 2));
        }

        console.log('\n📋 Step 3: Check Focus State');
        const activeElement = await page.evaluate(() => {
            const active = document.activeElement;
            return {
                tagName: active.tagName,
                id: active.id,
                className: active.className,
                isInput: active.id === 'input'
            };
        });
        console.log('Active element:', JSON.stringify(activeElement, null, 2));

        console.log('\n📋 Step 4: Try to Focus Input');
        await page.focus('#input');
        await page.waitForTimeout(500);

        const focusedElement = await page.evaluate(() => {
            const active = document.activeElement;
            return {
                tagName: active.tagName,
                id: active.id,
                isInput: active.id === 'input'
            };
        });
        console.log('After focus(), active element:', JSON.stringify(focusedElement, null, 2));

        console.log('\n📋 Step 5: Try Typing "test"');
        try {
            await page.keyboard.type('test');
            await page.waitForTimeout(1000);

            const inputValue = await page.$eval('#input', el => el.value);
            console.log('Input value after typing:', inputValue);

            if (inputValue === 'test') {
                console.log('✅ SUCCESS: Typing works!');
            } else {
                console.log('❌ FAILED: Expected "test", got:', inputValue);
            }
        } catch (error) {
            console.log('❌ FAILED: Typing error:', error.message);
        }

        console.log('\n📋 Step 6: Check Preview Area');
        const previewContent = await page.$eval('#phoneme-preview-main', el => el.innerHTML);
        console.log('Preview content:', previewContent);

        if (previewContent.includes('phoneme-with-image')) {
            console.log('✅ Phonemes appeared in preview');
        } else {
            console.log('❌ No phonemes in preview');
        }

        console.log('\n📋 Step 7: Click Preview and Try Typing');
        await page.click('#phoneme-preview-main');
        await page.waitForTimeout(500);

        const afterClickFocus = await page.evaluate(() => document.activeElement.id);
        console.log('After clicking preview, active element:', afterClickFocus);

        await page.keyboard.type('h');
        await page.waitForTimeout(1000);

        const finalValue = await page.$eval('#input', el => el.value);
        console.log('Final input value:', finalValue);

        console.log('\n📸 Taking screenshot for visual inspection...');
        await page.screenshot({ path: 'test-screenshots/debug-input-issue.png', fullPage: true });

        console.log('\n📋 Step 8: Check for JavaScript Errors');
        const errors = await page.evaluate(() => {
            // Check if key functions exist
            return {
                updatePhonemePreview: typeof updatePhonemePreview !== 'undefined',
                inputEl: typeof inputEl !== 'undefined',
                renderTextWithPhonemes: typeof renderTextWithPhonemes !== 'undefined'
            };
        });
        console.log('Function availability:', JSON.stringify(errors, null, 2));

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        // Keep browser open for inspection
        console.log('\n⏸️  Browser kept open for manual inspection...');
        console.log('Press Ctrl+C to exit');

        // Wait for user to see the issue
        await new Promise(resolve => {
            setTimeout(() => {
                browser.close();
                console.log('\n🏁 Debug complete');
            }, 30000); // Keep open for 30 seconds
        });
    }
})();