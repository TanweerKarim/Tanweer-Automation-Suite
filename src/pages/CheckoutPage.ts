import { Page, expect } from '@playwright/test';
import { Navbar } from '../components/navbar';
import {
    CheckoutOptions,
    Address,
    PaymentInfo_CreditCard
} from '../types/checkout-options';

export class CheckoutPage {
    readonly page: Page;
    readonly navbar: Navbar;

    constructor(page: Page) {
        this.page = page;
        this.navbar = new Navbar(page);
    }

    private getCheckoutTabLocator(tabName: string) {
        switch (tabName) {
            case 'Billing Address':
                return this.page.locator("//li[@id='opc-billing']");
            case 'Shipping Address':
                return this.page.locator("//li[@id='opc-shipping']");
            case 'Shipping Method':
                return this.page.locator("//li[@id='opc-shipping_method']");
            case 'Payment Method':
                return this.page.locator("//li[@id='opc-payment_method']");
            case 'Payment Information':
                return this.page.locator("//li[@id='opc-payment_info']");
            case 'Confirm Order':
                return this.page.locator("//li[@id='opc-confirm_order']");
            default:
                throw new Error(`Unknown checkout step ${tabName}`);
        }
    }

    private async openStep(step: string) {
        const header = this.getCheckoutTabLocator(step);
        await header.scrollIntoViewIfNeeded();
        try {
            await header.click({ trial: false });
        } catch {
            // ignore if not clickable
        }
        await this.page.waitForTimeout(300);
    }

    private async fillAddress(addr: Address, sectionSelector: string) {


        // Country
        await this.page.locator(`${sectionSelector} select[id*='Country'], ${sectionSelector} select[name*='Country']`)
            .first()
            .selectOption({ label: addr.country });

        // State (if applicable)
        if (addr.state) {
            await this.page.locator(`${sectionSelector} select[id*='State'], ${sectionSelector} select[name*='State']`)
                .first()
                .selectOption({ label: addr.state })
                .catch(async () => {
                    // fallback: contains text
                    const stateSelect = this.page.locator(`${sectionSelector} select[id*='State'], ${sectionSelector} select[name*='State']`);
                    const opt = stateSelect.locator(`.//option[contains(., ${JSON.stringify(addr.state)})]`);
                    const value = await opt.first().getAttribute('value');
                    if (value) await stateSelect.first().selectOption(value);
                });
        }

        // Simple direct mapping
        const fields: Record<string, string | undefined> = {
            City: addr.city,
            Address1: addr.address1,
            Address2: addr.address2,
            ZipPostalCode: addr.zipPostalCode,
            PhoneNumber: addr.phoneNumber,
            FaxNumber: addr.faxNumber
        };

        for (const [key, value] of Object.entries(fields)) {
            if (!value) continue;
            await this.page
                .locator(`${sectionSelector} input[id*='${key}'], ${sectionSelector} input[name*='${key}']`)
                .first()
                .fill(value);
        }
    }


    private async chooseShippingMethod(name: string) {
        await this.page.locator(`//label[contains(@for,'shippingoption') and text()='${name}']`).check();
    }

    private async choosePaymentMethod(methodType: string) {
        const friendlyMap: Record<string, string> = {
            'COD': 'Cash On Delivery (COD)',
            'CheckMoneyOrder': 'Check / Money Order',
            'CreditCard': 'Credit Card',
            'PurchaseOrder': 'Purchase Order'
        };
        if ((friendlyMap as any)[methodType]) {
            const mapped = (friendlyMap as any)[methodType];
            await this.page.locator(`//label[contains(@for,'paymentmethod') and contains(text(),'${mapped}')]`).check();
        }
    }

    private async fillPaymentInfo(payment: any) {
        if (!payment || !payment.type) return;

        switch (payment.type) {
            case 'COD':
                await expect(this.page.locator(`//p[text()='You will pay by COD']`)).toBeVisible({ timeout: 2000 }).catch(() => { });
                break;

            case 'CheckMoneyOrder':
                await expect(this.page.locator(`//p[contains(.,'Mail Personal or Business Check')]`)).toBeVisible({ timeout: 2000 }).catch(() => { });
                break;

            case 'CreditCard':
                {
                    const cc = payment as PaymentInfo_CreditCard;
                    await this.page.locator('#CreditCardType').selectOption({ label: cc.cardType });
                    await this.page.getByRole('textbox', { name: 'Cardholder name' }).fill(cc.cardHolderName);
                    await this.page.getByRole('textbox', { name: 'Card number' }).fill(cc.cardNumber);
                    await this.page.getByLabel('Expiration date').selectOption({ label: String(cc.expireMonth) });
                    await this.page.locator('#ExpireYear').selectOption({ label: String(cc.expireYear) });
                    await this.page.getByRole('textbox', { name: 'Card code' }).fill(cc.cardCode);
                }
                break;

            case 'PurchaseOrder':
                {
                    const po = payment as { type: 'PurchaseOrder'; poNumber: string };
                    const poInput = this.page.locator("//input[contains(@id,'PONumber') or contains(@name,'PONumber') or contains(@id,'PurchaseOrderNumber')]");
                    if (await poInput.count() > 0) await poInput.first().fill(po.poNumber);
                }
                break;

            default:
                throw new Error(`Unsupported payment type ${payment.type}`);
        }
    }

    async completeCheckOut(data: CheckoutOptions) {
        await this.openStep('Billing Address');

        if (data.billing.useNewAddress) {
            await this.page.locator("//select[@name='billing_address_id']")
                .selectOption({ label: "New Address" });
            await this.fillAddress(data.billing.address!, "#billing-new-address-form");
            const billingContinue = this.page.locator("//div[@id='billing-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
            if (await billingContinue.count() > 0) await billingContinue.first().click();
        } else {
            const billingContinue = this.page.locator("//div[@id='billing-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
            if (await billingContinue.count() > 0) await billingContinue.first().click();
        }

        await this.openStep('Shipping Address');

        if (data.shipping.inStorePickup) {
            const pickup = this.page.locator("//input[@id='PickUpInStore' or contains(@name,'pickup') or contains(@id,'pickup')]");
            if (await pickup.count() > 0) {
                await pickup.first().check();
            }
            const shipContinue = this.page.locator("//div[@id='shipping-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
            if (await shipContinue.count() > 0) await shipContinue.first().click();
        } else if (data.shipping.useNewAddress) {
            const shippingPrefix = "//div[contains(@id,'shipping') or contains(@class,'shipping') or //div[@id='shipping-step']]";
            await this.fillAddress(data.billing.address!, "#billing-new-address-form");
            const shipContinue = this.page.locator("//div[@id='shipping-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
            if (await shipContinue.count() > 0) await shipContinue.first().click();
        } else {
            // reuse existing shipping address and continue
            const shipContinue = this.page.locator("//div[@id='shipping-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
            if (await shipContinue.count() > 0) await shipContinue.first().click();
        }

        await this.openStep('Shipping Method');
        await this.chooseShippingMethod(data.shippingMethod);
        const shipMethodContinue = this.page.locator("//div[@id='shipping-method-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
        if (await shipMethodContinue.count() > 0) await shipMethodContinue.first().click();

        await this.openStep('Payment Method');
        await this.choosePaymentMethod((data.payment as any).type);

        const payMethodContinue = this.page.locator("//div[@id='payment-method-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
        if (await payMethodContinue.count() > 0) await payMethodContinue.first().click();

        await this.openStep('Payment Information');
        await this.fillPaymentInfo(data.payment);
        const payInfoContinue = this.page.locator("//div[@id='payment-info-buttons-container']//input[@type='button' and (contains(@value,'Continue') or contains(@value,'continue'))]");
        if (await payInfoContinue.count() > 0) await payInfoContinue.first().click();

        await this.openStep('Confirm Order');
        if (data.confirmOrder) {
            const confirmBtn = this.page.locator("//div[@id='confirm-order-buttons-container']//input[@type='button' and (contains(@value,'Confirm') or contains(@value,'confirm'))]");
            if (await confirmBtn.count() > 0) {
                await confirmBtn.first().click();
            }
        }
        await this.page.waitForTimeout(500);
        const success = this.page.locator("//div[@class='title']//strong[text()='Your order has been successfully processed!']");
        await expect(success).toBeVisible({ timeout: 8000 });
    }
}
