import dotenv from 'dotenv';
dotenv.config();

import { test, BrowserContext, Page } from '@playwright/test';
import { LandingPage } from '../src/pages/LandingPage';
import { ProductPage } from '../src/pages/ProductPage';
import rawProducts from '../test-data/product.json';
import { ProductOptions } from '../src/types/product-options';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import rawCheckout from '../test-data/checkout.json';
import { CheckoutOptions } from '../src/types/checkout-options';
import rawCategories from "../test-data/category-product.json";
const productsData = rawProducts as unknown as { featuredItems: ProductOptions[] };
const checkoutDetails = rawCheckout as unknown as CheckoutOptions;
const categoriesData = rawCategories as {
  categories: Array<{
    categoryName: string;
    products: ProductOptions[];
  }>;
};

test.describe.serial('E2E Add products, verify cart and checkout', () => {
  let context: BrowserContext;
  let page: Page;
  let landingPageObj: LandingPage;
  let productPageObj: ProductPage;
  let cartPageObj: CartPage;
  let checkoutPageObj: CheckoutPage;

  const USER_EMAIL = process.env.USER_EMAIL!;
  const USER_PASSWORD = process.env.USER_PASSWORD!;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    landingPageObj = new LandingPage(page);
    productPageObj = new ProductPage(page);
    cartPageObj = new CartPage(page);
    checkoutPageObj = new CheckoutPage(page);
    await page.goto('/');
    await landingPageObj.navbar.verifyLandingPage();
    const loginPage = await landingPageObj.clickLoginButton();
    await loginPage.verifyLogInPage();
    await loginPage.loginUser(USER_EMAIL, USER_PASSWORD);
    await landingPageObj.verifyFeatureProductTitle();
  });

  test.afterAll(async () => {
    await context.close();
  });
  test('Add all featured items, verify cart, and checkout', async () => {
    for (const featuredItem of productsData.featuredItems) {
      await landingPageObj.openFeatureItem(featuredItem.productName);
      await productPageObj.addItemToCart(featuredItem);
      await productPageObj.navbar.gotoHome();
    }
    await landingPageObj.navbar.gotoCart();
    const productNames = productsData.featuredItems.map(item => item.productName);
    await cartPageObj.verifyPriceCalculation(productNames);
    await cartPageObj.checkoutWithItem(productNames);
    await checkoutPageObj.completeCheckOut(checkoutDetails);
  });

  test('Add different Category Items, verify cart, and checkout', async () => {
    for (const category of categoriesData.categories) {
      for (const product of category.products) {
        await landingPageObj.navbar.openCategory(category.categoryName);
        await landingPageObj.openProduct(product.productName);
        await productPageObj.addItemToCart(product);
        await productPageObj.navbar.gotoHome();
      }
    }
    await landingPageObj.navbar.gotoCart();
    const productNames = categoriesData.categories.flatMap(cat =>
      cat.products.map(p => p.productName)
    );
    await cartPageObj.verifyPriceCalculation(productNames);
    await cartPageObj.checkoutWithItem(productNames);
    await checkoutPageObj.completeCheckOut(checkoutDetails);
  });
});
