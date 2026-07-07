import { test, expect } from '@playwright/test';

test('set a fake location', async ({ browser }) => {
  const context = await browser.newContext({
    geolocation: { latitude: 51.5074, longitude: -0.1278 },
    permissions: ['geolocation'],
  });

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com');

  console.log('Fake location set to London (51.5074, -0.1278)');
  await expect(page).toHaveTitle(/Swag Labs/);

  await context.close();
});

test('grant camera and microphone permissions', async ({ browser, browserName }) => {
  // skip on firefox and webkit - camera/mic permissions not supported
  if (browserName !== 'chromium') {
    test.skip();
    return;
  }

  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],
  });

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com');

  console.log('Camera and microphone permissions granted on Chromium!');
  await expect(page).toHaveTitle(/Swag Labs/);

  await context.close();
});

test('deny geolocation permission', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: [],
  });

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com');

  const permissionStatus = await page.evaluate(async () => {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  });

  console.log('Geolocation permission status:', permissionStatus);
  expect(['denied', 'prompt']).toContain(permissionStatus);

  await context.close();
});

test('set different locations and verify', async ({ browser }) => {
  const locations = [
    { name: 'London', latitude: 51.5074, longitude: -0.1278 },
    { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
    { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  ];

  for (const location of locations) {
    const context = await browser.newContext({
      geolocation: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      permissions: ['geolocation'],
    });

    const page = await context.newPage();
    await page.goto('https://www.saucedemo.com');

    const coords = await page.evaluate(async () => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
          err => resolve(null)
        );
      });
    });

    if (coords) {
      console.log(`${location.name}: lat=${coords.lat} lng=${coords.lng}`);
      expect(coords.lat).toBeCloseTo(location.latitude, 2);
      expect(coords.lng).toBeCloseTo(location.longitude, 2);
    } else {
      console.log(`${location.name}: geolocation not available`);
    }

    await context.close();
  }
});

test('change location mid-test', async ({ browser }) => {
  const context = await browser.newContext({
    geolocation: { latitude: 51.5074, longitude: -0.1278 },
    permissions: ['geolocation'],
  });

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com');
  console.log('Started in London');

  await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
  console.log('Changed location to Paris');

  await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });
  console.log('Changed location to New York');

  await expect(page).toHaveTitle(/Swag Labs/);
  await context.close();
});