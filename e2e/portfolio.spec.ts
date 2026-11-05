import { test, expect } from '@playwright/test';

test.describe('content', () => {
  test('hero and sections are present', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Michael Kariuki/i);
    await expect(page.locator('h1.kinetic')).toHaveAttribute('aria-label', /Fast products/i);
    for (const id of ['experience', 'work', 'practice', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('experience entry states role, dates and live products', async ({ page }) => {
    await page.goto('/#experience');
    const xp = page.locator('#experience');
    await expect(xp.locator('.p-name')).toHaveText(/openslot/i);
    await expect(xp.locator('.p-meta')).toContainText(/Full-Stack Engineer/i);
    await expect(xp.locator('.p-meta')).toContainText(/Feb 2024 - Sep 2026/);

    const links = await xp.locator('a').evaluateAll((nodes) => nodes.map((n) => (n as HTMLAnchorElement).href));
    expect(links).toContain('https://openslot.io/');
    expect(links).toContain('https://support.openslot.io/');
    expect(links.some((h) => h.startsWith('https://play.google.com/store/apps/details?id=com.openslot.businessapp'))).toBe(true);

    await expect(xp.locator('.xp li')).toHaveCount(7);
    await expect(xp).toContainText(/Owned the real-time messaging layer/);
    await expect(xp).toContainText(/Playwright end-to-end testing/);
  });

  test('selected work links resolve to the deployed apps', async ({ page }) => {
    await page.goto('/#work');
    const hrefs = await page.locator('#work a').evaluateAll((nodes) => nodes.map((n) => (n as HTMLAnchorElement).href));
    for (const expected of [
      'https://fixtrack.waigurumichael252.workers.dev/',
      'https://pulse.waigurumichael252.workers.dev/',
      'https://chess-puzzles.waigurumichael252.workers.dev/',
    ]) {
      expect(hrefs).toContain(expected);
    }
  });

  test('only finished projects are listed', async ({ page }) => {
    await page.goto('/#work');
    // .p-name is uppercased by CSS, so compare case-insensitively.
    const cards = await page.locator('#work .p-name').allInnerTexts();
    expect(cards.map((c) => c.trim().toLowerCase())).toEqual(['fixtrack', 'pulse', 'chess puzzles']);
    await expect(page.locator('#work')).not.toContainText(/Code Alchemy/i);
    await expect(page.locator('#work')).not.toContainText(/Hobby/i);
  });

  test('every in-page nav link targets an existing section', async ({ page }) => {
    await page.goto('/');
    const anchors = await page.locator('.site-nav a').evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('href') ?? ''),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(4);
    for (const href of anchors.filter((h) => h.startsWith('#'))) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });
});

test.describe('theme', () => {
  test('toggle switches theme and survives a reload', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const first = (await html.getAttribute('data-theme')) ?? 'light';
    await page.getByRole('button', { name: /switch color theme|switch to .* theme/i }).click();
    const second = await html.getAttribute('data-theme');
    expect(second).not.toBe(first);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', second!);
    expect(await page.evaluate(() => localStorage.getItem('mw-theme'))).toBe(second);
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('only the experience link stays in the nav', async ({ page }) => {
    await page.goto('/');
    const visible = await page.locator('.site-nav a:visible').allInnerTexts();
    expect(visible).toHaveLength(1);
    expect(visible[0].toLowerCase()).toContain('experience');
  });
});
