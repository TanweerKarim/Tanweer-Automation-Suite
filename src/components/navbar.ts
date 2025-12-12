// components/navbar.ts
import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class Navbar {
  readonly page: Page;
  readonly logo: Locator;
  readonly shoppingCartBtn:Locator;
  readonly wishlistBtn: Locator;
  readonly searchInput: Locator;
  readonly searchBtn: Locator;
  readonly loginBtn: Locator;
  readonly registerBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('//div[@class="header-logo"]'); // or use header logo selector
    this.searchInput = page.locator( "//input[@id='small-searchterms']").first();
    this.searchBtn = page.locator("//input[@type='submit']"); // loosened email locator
    this.loginBtn = page.locator("//a[text()='Log in']");
    this.registerBtn = page.locator("//a[text()='Register']");
    this.shoppingCartBtn = page.locator("//span[text()='Shopping cart']");
    this.wishlistBtn = page.locator("//span[text()='Wishlist']");
  }

  async gotoHome() {
    await this.logo.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchBtn.click();
  }

  async gotoCart() {
    await this.shoppingCartBtn.click();
  }

  async gotoWishlist() {
    await this.wishlistBtn.click();
  }

  async gotoLogin(){
    await this.loginBtn.click();
    return new LoginPage(this.page);
  }

  async gotoRegister(){
    await this.registerBtn.click();
  }

  async verifyLandingPage(){
    await expect(this.page).toHaveURL('https://demowebshop.tricentis.com/');
    await expect(this.registerBtn).toBeVisible();
    await expect(this.loginBtn).toBeVisible();
    await expect(this.shoppingCartBtn).toBeVisible();
    await expect(this.wishlistBtn).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchBtn).toBeVisible();
  }

  async openCategory(category:string){
    await this.page.locator(`//ul[@class='top-menu']//a[normalize-space()='${category}']`).click();
  }
}
