import puppeteer from 'puppeteer';

/**
 * @param {string} platform - wb или ozon
 * @param {string} productId - ID товара
 */
export default async function parseProduct(platform, productId) {
  let url;
  if (platform === 'wb') {
    url = `https://www.wildberries.ru/catalog/${productId}/detail.aspx`;
  } else if (platform === 'ozon') {
    url = `https://www.ozon.ru/product/${productId}/`;
  } else {
    throw new Error('❌ Неизвестная платформа. Используй "wb" или "ozon".');
  }

  let browser;
  const isHeadless = process.env.HEADLESS !== 'false'; // по умолчанию - true

  try {
    browser = await puppeteer.launch({
      headless: isHeadless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36');
    await page.setViewport({ width: 1200, height: 800 });

    let title = 'Не найдено';
    let price = '-';
    let inStock = '-';
    let imageUrl = null;

    if (platform === 'wb') {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      try {
        title = await page.$eval('h1, h3', el => el.innerText.trim());
      } catch {
        title = 'Название не найдено';
      }

      try {
        price = await page.$eval(`[class*='priceBlockFinalPrice']`, el => el.innerText.trim());
      } catch {
        price = 'Цена не найдена';
      }

      try {
        imageUrl = await page.$eval('img[src*="basket"], img[src*="photo"]', el => el.src);
      } catch {
        imageUrl = null;
      }

      const html = await page.content();
      inStock = html.includes('Добавить в корзину') ? 'Да' : 'Нет';
    }

    if (platform === 'ozon') {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      try {
        await page.waitForSelector('[data-widget="webProductHeading"]', { timeout: 10000 });
        title = await page.$eval('[data-widget="webProductHeading"]', el => el.innerText.trim());
      } catch {
        title = 'Название не найдено';
      }

      try {
        price = await page.$eval('[class="pdp_b7f tsHeadline500Medium"]', el => el.innerText.trim());
      } catch {
        price = 'Цена не найдена';
      }

      try {
        imageUrl = await page.$eval('img[alt][src]', el => el.src);
      } catch {
        imageUrl = null;
      }

      try {
        await page.waitForSelector('[data-widget="webAddToCart"]', { timeout: 5000 });
        inStock = 'Да';
      } catch {
        inStock = 'Нет';
      }
    }

    return { title, price, inStock, url, imageUrl };
  } catch (err) {
    console.error('Ошибка парсинга:', err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}
