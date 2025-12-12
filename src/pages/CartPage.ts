import { Locator, Page,expect } from '@playwright/test';
import { Navbar } from '../components/navbar';

export class CartPage {
    readonly page: Page;
    readonly navbar: Navbar;
    readonly checkoutBtn: Locator;
    readonly updateShoppingCartBtn: Locator;
    readonly termsOfServiceCheckbox: Locator;
    constructor(page: Page) {
        this.page = page;
        this.navbar = new Navbar(page);
        this.checkoutBtn = page.locator("//button[@name='checkout']");
        this.updateShoppingCartBtn = page.locator("//input[@name='updatecart']");
        this.termsOfServiceCheckbox = page.locator("//div[@class='terms-of-service']//input[@type='checkbox']");
    }

    async checkoutWithItem(itemNames:string[]){
        await this.verifyCheckoutItem(itemNames);
        await this.termsOfServiceCheckbox.check();
        await this.checkoutBtn.click();
    }

    async verifyCheckoutItem(itemNames:string[]){
        for(const itemName of itemNames){
            await expect(this.page.locator(`//tr[@class='cart-item-row'][.//a[@class='product-name' and normalize-space(.)="${itemName}"]]//span[@class='product-subtotal']`)).toBeVisible();
        }
    }

    async calculateItemTotal(itemNames:string[]){
        let sum = 0.0;
        for(const itemName of itemNames){
            const subTotalText = await this.page.locator(`//tr[@class='cart-item-row'][.//a[@class='product-name' and normalize-space(.)="${itemName}"]]//span[@class='product-subtotal']`).innerText();
            const subTotal = parseFloat(subTotalText);
            sum += subTotal;
        }
        return sum;
    }

    async verifyPriceCalculation(itemNames:string[]){
        const sumOfItems = await this.calculateItemTotal(itemNames);
        const extractedTotal = parseFloat(await this.page.locator('//span[@class="product-price order-total"]').innerText());
        expect(extractedTotal).toBe(sumOfItems);
    }

    async removeItemFromCart(itemNames:string[]){
        for(const itemName of itemNames){
            await this.page.locator(`//tr[@class='cart-item-row'][.//a[@class='product-name' and normalize-space(.)="${itemName}"]]//input[@name='removefromcart']`).click();
        }
        await this.updateShoppingCartBtn.click();
    }
}