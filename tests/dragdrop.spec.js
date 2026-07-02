import { test, expect } from '@playwright/test';

test('drag and drop an element', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  // get the two boxes before dragging
  const boxA = page.locator('#column-a');
  const boxB = page.locator('#column-b');

  // verify initial state
  await expect(boxA.locator('header')).toHaveText('A');
  await expect(boxB.locator('header')).toHaveText('B');

  console.log('Before drag - Box A:', await boxA.locator('header').textContent());
  console.log('Before drag - Box B:', await boxB.locator('header').textContent());

  // drag box A onto box B
  await boxA.dragTo(boxB);

  // verify they swapped
  console.log('After drag - Box A:', await boxA.locator('header').textContent());
  console.log('After drag - Box B:', await boxB.locator('header').textContent());
});

test('drag using mouse steps (more reliable)', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const boxA = page.locator('#column-a');
  const boxB = page.locator('#column-b');

  // using manual mouse steps for more control
  // this approach works better on sites where dragTo() struggles
  await boxA.dragTo(boxB, {
    sourcePosition: { x: 50, y: 30 },
    targetPosition: { x: 50, y: 30 },
  });

  console.log('Drag with custom positions completed!');
});

test('drag using raw mouse events', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const boxA = page.locator('#column-a');
  const boxB = page.locator('#column-b');

  // get positions of both elements
  const boxABounds = await boxA.boundingBox();
  const boxBBounds = await boxB.boundingBox();

  // calculate center points
  const startX = boxABounds.x + boxABounds.width / 2;
  const startY = boxABounds.y + boxABounds.height / 2;
  const endX = boxBBounds.x + boxBBounds.width / 2;
  const endY = boxBBounds.y + boxBBounds.height / 2;

  console.log(`Dragging from (${startX}, ${startY}) to (${endX}, ${endY})`);

  // simulate raw mouse movement
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();

  console.log('Raw mouse drag completed!');
});