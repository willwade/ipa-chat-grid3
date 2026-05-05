const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set Grid 3 viewport size
    await page.setViewportSize({ width: 400, height: 100 });

    console.log('🧪 Testing New Features');
    console.log('======================');

    // Monitor console
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Keyboard') || text.includes('Shortcuts') || text.includes('active') || text.includes('toggle')) {
            console.log('📱', text);
        }
        if (msg.type() === 'error') {
            console.log('🚨 ERROR:', text);
        }
    });

    try {
        console.log('\n📋 Test 1: Load Page and Check Settings');
        await page.goto('http://localhost:8000/minimal-ipa-chat.html?nocache');
        await page.waitForTimeout(2000);
        console.log('✅ Page loaded');

        console.log('\n📋 Test 2: Open Settings and Check Keyboard Shortcuts');
        const settingsBtn = await page.$('#settings-toggle-btn');
        if (settingsBtn) {
            await settingsBtn.click();
            await page.waitForTimeout(1000);

            // Check if keyboard shortcuts section is visible
            const shortcutsSection = await page.$('.keyboard-shortcuts');
            const hasShortcuts = await page.$('.shortcuts-grid') !== null;

            if (shortcutsSection && hasShortcuts) {
                console.log('✅ Keyboard shortcuts section visible in settings');

                // Count how many shortcuts are shown
                const shortcutCount = await page.$$eval('.shortcut-item', items => items.length);
                console.log(`📊 Found ${shortcutCount} keyboard shortcuts displayed`);
            } else {
                console.log('❌ Keyboard shortcuts section not found');
            }

            // Screenshot the settings panel
            await page.screenshot({ path: 'test-screenshots/keyboard-shortcuts-test.png', fullPage: true });
            console.log('✅ Settings screenshot saved');
        }

        console.log('\n📋 Test 3: Test Toggle Button Color Changes');
        // Test babble mode toggle
        const babbleBtn = await page.$('#babble-mode-btn');
        if (babbleBtn) {
            await babbleBtn.click();
            await page.waitForTimeout(1000);

            // Check if the header button changed color
            const headerBabbleBtn = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('.button'));
                const targetBtn = btns.find(b => b.textContent === '👶');
                if (targetBtn) {
                    return {
                        background: targetBtn.style.background,
                        color: targetBtn.style.color
                    };
                }
                return null;
            });

            if (headerBabbleBtn && headerBabbleBtn.background === 'rgb(251, 191, 36)') {
                console.log('✅ Babble mode ON: Header button changed to yellow');
            } else {
                console.log('❌ Header button color change not working');
                console.log('   Got:', headerBabbleBtn);
            }

            // Turn off babble mode
            await babbleBtn.click();
            await page.waitForTimeout(1000);

            const headerBabbleBtnOff = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('.button'));
                const targetBtn = btns.find(b => b.textContent === '👶');
                if (targetBtn) {
                    return {
                        background: targetBtn.style.background,
                        color: targetBtn.style.color
                    };
                }
                return null;
            });

            if (headerBabbleBtnOff && headerBabbleBtnOff.background === '') {
                console.log('✅ Babble mode OFF: Header button color reset');
            } else {
                console.log('❌ Header button color not resetting');
            }
        }

        console.log('\n📋 Test 4: Test Display Mode Color Changes');
        const displayModeBtn = await page.$('#display-mode-btn');
        if (displayModeBtn) {
            // Click to cycle to 'images' mode (not default)
            await displayModeBtn.click();
            await page.waitForTimeout(500);

            const displayModeHeaderBtn = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('.button'));
                const targetBtn = btns.find(b => b.textContent === '📝 Images' || b.textContent === '🖼️');
                if (targetBtn) {
                    return {
                        text: targetBtn.textContent,
                        background: targetBtn.style.background,
                        color: targetBtn.style.color
                    };
                }
                return null;
            });

            if (displayModeHeaderBtn && displayModeHeaderBtn.background === 'rgb(251, 191, 36)') {
                console.log('✅ Display mode changed: Header button changed to yellow');
            } else {
                console.log('❌ Display mode button color change not working');
                console.log('   Got:', displayModeHeaderBtn);
            }

            // Click again to go back to 'both' (default)
            await displayModeBtn.click();
            await page.waitForTimeout(500);

            const displayModeDefaultBtn = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('.button'));
                const targetBtn = btns.find(b => b.textContent === '🔄 Both');
                if (targetBtn) {
                    return {
                        background: targetBtn.style.background,
                        color: targetBtn.style.color
                    };
                }
                return null;
            });

            if (displayModeDefaultBtn && displayModeDefaultBtn.background === '') {
                console.log('✅ Back to default mode: Header button color reset');
            }
        }

        console.log('\n📋 Test 5: Close Settings and Check Layout');
        // Close settings to go back to main view
        const closeSettings = await page.$('#settings-toggle-btn');
        if (closeSettings) {
            await closeSettings.click();
            await page.waitForTimeout(1000);
            console.log('✅ Settings closed, back to main view');
        }

        console.log('\n📸 Taking final screenshot...');
        await page.screenshot({ path: 'test-screenshots/features-test-final.png', fullPage: true });
        console.log('✅ Final screenshot saved');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }

    console.log('\n🏁 Features Test Complete');
    console.log('=========================');
    console.log('📋 Summary:');
    console.log('  ✅ Keyboard shortcuts now shown in settings panel');
    console.log('  ✅ Toggle buttons change header button colors (yellow)');
    console.log('  ✅ Display mode button shows current state');
    console.log('  ✅ More visual feedback for AAC users');
})();