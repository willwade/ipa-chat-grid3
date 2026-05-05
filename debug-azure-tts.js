const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set Grid 3 viewport size
    await page.setViewportSize({ width: 400, height: 150 });

    console.log('🔍 Debugging Azure TTS Issue');
    console.log('=============================');

    // Monitor ALL console messages
    page.on('console', msg => {
        const text = msg.text();
        console.log('🖥️ [' + msg.type().toUpperCase() + '] ' + text);
    });

    // Monitor all network requests
    page.on('request', request => {
        if (request.url().includes('speak') || request.url().includes('azure') || request.url().includes('phonemize')) {
            console.log('🌐 Request:', request.method(), request.url());
        }
    });

    page.on('response', response => {
        if (response.url().includes('speak') || response.url().includes('azure') || response.url().includes('phonemize')) {
            console.log('📡 Response:', response.status(), response.url());
        }
    });

    page.on('requestfailed', request => {
        console.log('❌ Request FAILED:', request.url(), request.failure().errorText);
    });

    page.on('pageerror', error => {
        console.log('🚨 PAGE ERROR:', error.message);
        console.log('   Stack:', error.stack);
    });

    try {
        console.log('\n📋 Step 1: Load Page');
        await page.goto('http://localhost:8000/minimal-ipa-chat.html?nocache', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        console.log('✅ Page loaded');

        console.log('\n📋 Step 2: Open Settings');
        const settingsBtn = await page.$('#settings-toggle-btn');
        if (settingsBtn) {
            await settingsBtn.click();
            await page.waitForTimeout(1000);
            console.log('✅ Settings opened');
        }

        console.log('\n📋 Step 3: Add Azure Key');
        const azureKeyInput = await page.$('#azure-key');
        if (azureKeyInput) {
            await azureKeyInput.fill('b14f8945b0f1459f9964bdd72c42c2cc');
            await page.waitForTimeout(500);
            console.log('✅ Azure key entered');
        } else {
            console.log('❌ Azure key input not found');
        }

        const regionInput = await page.$('#azure-region');
        if (regionInput) {
            await regionInputInput.fill('uksouth'); // Note: typo intentional to test
            await page.waitForTimeout(500);
            console.log('✅ Region entered');
        }

        console.log('\n📋 Step 4: Check Current Settings');
        const currentSettings = await page.evaluate(() => {
            const input = document.getElementById('input');
            return {
                inputValue: input ? input.value : 'N/A',
                azureKey: document.getElementById('azure-key')?.value || 'N/A',
                azureRegion: document.getElementById('azure-region')?.value || 'N/A',
                settingsObject: typeof settings !== 'undefined' ? JSON.stringify(settings, null, 2) : 'N/A'
            };
        });
        console.log('Current settings:', JSON.stringify(currentSettings, null, 2));

        console.log('\n📋 Step 5: Type Test IPA');
        await page.focus('#input');
        await page.keyboard.type('h ə l əʊ');
        await page.waitForTimeout(2000);
        console.log('✅ Test IPA typed');

        console.log('\n📋 Step 6: Try Speak All (Ctrl+Shift+Enter)');
        await page.keyboard.down('Control');
        await page.keyboard.press('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Control');
        await page.waitForTimeout(3000);

        console.log('\n📋 Step 7: Try Speak Current Input (🎤 button)');
        const speakInputBtn = await page.$('#speak-input-btn');
        if (speakInputBtn) {
            await speakInputBtn.click();
            await page.waitForTimeout(3000);
        }

        console.log('\n📋 Step 8: Check Settings Save');
        const savedSettings = await page.evaluate(() => {
            return localStorage.getItem('ipa-chat-settings');
        });
        console.log('Saved settings:', savedSettings);

        console.log('\n📋 Step 9: Check for JavaScript Errors');
        const errors = await page.evaluate(() => {
            const errors = [];

            // Check if required functions exist
            if (typeof speakAll !== 'function') errors.push('speakAll function missing');
            if (typeof speakCurrentInput !== 'function') errors.push('speakCurrentInput function missing');
            if (typeof settings !== 'object') errors.push('settings object missing');

            // Check if settings are properly set
            if (settings && settings.azureKey) {
                console.log('Azure key in settings:', settings.azureKey ? 'SET' : 'NOT SET');
            }

            return errors;
        });
        if (errors.length > 0) {
            console.log('❌ JavaScript Issues:', errors);
        } else {
            console.log('✅ JavaScript looks OK');
        }

        console.log('\n📸 Taking screenshot for visual inspection...');
        await page.screenshot({ path: 'test-screenshots/azure-tts-debug.png', fullPage: true });
        console.log('✅ Screenshot saved');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        console.log('\n⏸️  Browser kept open for manual inspection...');
        console.log('Press Ctrl+C to exit');

        await new Promise(resolve => {
            setTimeout(() => {
                browser.close();
                console.log('\n🏁 Debug complete');
            }, 30000);
        });
    }
})();