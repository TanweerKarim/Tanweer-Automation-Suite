import { Page,expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly url: string;
    readonly emailInput = "//input[@id='Email']";
    readonly passwordInput = "//input[@id='Password']";
    readonly loginBtn = "//input[@value='Log in']";
    readonly loginPageTitle = "//h1[text()='Welcome, Please Sign In!']";

    constructor(page: Page) {
        this.page = page;
    }

    private async fillEmail(email: string){
        await this.page.locator(this.emailInput).fill(email);
    }

    private async fillPassword(password: string){
        await this.page.locator(this.passwordInput).fill(password);
    }

    private async clickLoginBtn(){
        await this.page.locator(this.loginBtn).click();
    }

    async verifyLogInPage(){
        await expect(this.page).toHaveURL('https://demowebshop.tricentis.com/login');
        await expect(this.page.locator(this.loginPageTitle)).toBeVisible();
    }

    async loginUser(email:string,password:string){
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLoginBtn();
    }

    
    
}