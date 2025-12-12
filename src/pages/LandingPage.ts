import { Locator, Page,expect } from '@playwright/test';
import { Navbar } from '../components/navbar';

export class LandingPage {
    readonly page: Page;
    readonly navbar: Navbar;
    readonly featuredProductTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navbar = new Navbar(page);
        this.featuredProductTitle = this.page.locator("//div//strong[text()='Featured products']");
    }

    async clickLoginButton(){
        const loginPageObj = await this.navbar.gotoLogin();
        return loginPageObj;
    }

    async openFeatureItem(itemName:string){
        let itemLocator = `//h2[a[normalize-space(text())='${itemName}']]`;
        await this.page.locator(itemLocator).waitFor({state:"attached"});
        await this.page.locator(itemLocator).click();
    }

    async openProduct(itemName:string){
        let itemLocator = `//h2[a[normalize-space(text())="${itemName}"]]`;
        await this.page.locator(itemLocator).waitFor({state:"attached"});
        await this.page.locator(itemLocator).click();
    }

    async verifyFeatureProductTitle(){
        await this.featuredProductTitle.scrollIntoViewIfNeeded();
        await expect(this.featuredProductTitle).toBeVisible();
    }
}