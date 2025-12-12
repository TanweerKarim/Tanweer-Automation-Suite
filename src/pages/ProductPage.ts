import { Locator, Page, expect } from '@playwright/test';
import { Navbar } from '../components/navbar';
import { ApparelOptions, ComputerOptions, GiftCardOptions, JewelryOptions, ProductOptions } from '../types/product-options';

export class ProductPage {
  readonly page: Page;
  readonly navbar: Navbar;
  readonly recipientNameInput: Locator;
  readonly recipientEmailInput: Locator;
  readonly messageTextArea: Locator;
  readonly qtyInput: Locator;
  readonly addToCartBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new Navbar(page);
    this.recipientNameInput = page.locator("//input[@class='recipient-name']");
    this.recipientEmailInput = page.locator("//input[@class='recipient-email']");
    this.messageTextArea = page.locator("//textarea[@class='message']");
    this.qtyInput = page.locator("//input[@class='qty-input']");
    this.addToCartBtn = page.locator("//div[@class='add-to-cart-panel']//input[@value='Add to cart']");
  }

  private async fillRecipientName(recipientName: string) {
    await this.recipientNameInput.fill(recipientName);
  }

  private async fillRecipientEmail(recipientEmail: string) {
    await this.recipientEmailInput.fill(recipientEmail);
  }

  private async fillMessage(message: string) {
    await this.messageTextArea.fill(message);
  }

  private async fillQuantity(qty: number) {
    await this.qtyInput.fill(String(qty));
  }

  private async chooseOption(labelText: string) {
    const locator = this.page.locator(`//label[normalize-space(.)='${labelText}']`);
    await locator.first().check(); 
  }

  private async selectDropdown(dropdownSelector: string, visibleText: string) {
    const ddl = this.page.locator(dropdownSelector);
    await ddl.selectOption({ label: visibleText });
  }

  private async chooseColor(colorLabelOrValue: string) {
    await this.page.locator(`//span[@class='color-container' and @title='${colorLabelOrValue}' ]`).click();
  }

  private getAttributeDdLocatorByLabel(labelText: string) {
    const xpath = `//dt[label[normalize-space(.)=${JSON.stringify(labelText)}]]/following-sibling::dd[1]`;
    return this.page.locator(xpath);
  }

  private async chooseAttribute(attributeLabel: string, optionVisibleText: string) {
    const dd = this.getAttributeDdLocatorByLabel(attributeLabel);
    await dd.waitFor({ state: 'visible', timeout: 3000 });
    const selectInside = dd.locator('//select');
    if (await selectInside.count() > 0) {
      try {
        await selectInside.first().selectOption({ label: optionVisibleText });
        return;
      } catch (e) {
        const opt = selectInside.locator(`//option[contains(., ${JSON.stringify(optionVisibleText)})]`);
        if (await opt.count() > 0) {
          const value = await opt.first().getAttribute('value');
          if (value) {
            await selectInside.first().selectOption(value);
            return;
          }
        }
        throw e;
      }
    }
    const radioInside = dd.locator('//input[@type="radio"]');
    if (await radioInside.count() > 0) {
      const radio = dd.locator(
        `//label[contains(normalize-space(.), ${JSON.stringify(optionVisibleText)})]//input[@type="radio"]`
      );
      if (await radio.count() > 0) {
        await radio.first().check();
        return;
      }
  
      const radioSibling = dd.locator(
        `//input[@type="radio" and following-sibling::label[contains(normalize-space(.), ${JSON.stringify(optionVisibleText)})]]`
      );
      if (await radioSibling.count() > 0) {
        await radioSibling.first().check();
        return;
      }
  
      throw new Error(`Radio option "${optionVisibleText}" not found for attribute "${attributeLabel}"`);
    }
    const checkboxInside = dd.locator('//input[@type="checkbox"]');
    if (await checkboxInside.count() > 0) {
      const checkboxByLabelWrap = dd.locator(
        `//label[contains(normalize-space(.), ${JSON.stringify(optionVisibleText)})]//input[@type='checkbox']`
      );
      if (await checkboxByLabelWrap.count() > 0) {
        await checkboxByLabelWrap.first().check();
        return;
      }
  
      const checkboxSibling = dd.locator(
        `//input[@type='checkbox' and following-sibling::label[contains(normalize-space(.), ${JSON.stringify(optionVisibleText)})]]`
      );
      if (await checkboxSibling.count() > 0) {
        await checkboxSibling.first().check();
        return;
      }
  
      throw new Error(`Checkbox option "${optionVisibleText}" not found for attribute "${attributeLabel}"`);
    }
    throw new Error(`No select, radio, or checkbox found for attribute "${attributeLabel}"`);
  }
  

  async addItemToCart(options: ProductOptions) {
    if (options.qty && options.qty > 0) {
      await this.fillQuantity(options.qty);
    }

    switch (options.productType) {
      case 'gift-card': {
        const opt = options as GiftCardOptions;
        await this.fillRecipientName(opt.recipientName);
        await this.fillRecipientEmail(opt.recipientEmail);
        if (opt.message) await this.fillMessage(opt.message);
        break;
      }

      case 'laptop': {
        // no extra options; maybe nothing to do
        break;
      }

      case 'book': {
        // no extra options; maybe nothing to do
        break;
      }

      case 'computer': {
        const opt = options as ComputerOptions;
        if (opt.processor) await this.chooseAttribute('Processor', opt.processor);
        if (opt.ram) await this.chooseAttribute('RAM', opt.ram);
        if (opt.hdd) await this.chooseAttribute('HDD', opt.hdd);
        if (opt.software && opt.software.length) {
          for (const sw of opt.software) {
            await this.chooseAttribute('Software', sw);
          }
        }
        break;
      }

      case 'apparel and shoes': {
        const opt = options as ApparelOptions;
        if (opt.size) {
          await this.selectDropdown("//label[normalize-space(.)='Size']/ancestor::dt/following-sibling::dd//select", opt.size);
        }
        if (opt.color) {
          await this.chooseColor(opt.color);
        }
        break;
      }

      case 'jewelry': {
        const opt = options as JewelryOptions;
        if (opt.material) {
          await this.selectDropdown("//label[normalize-space(.)='Material']/ancestor::dt/following-sibling::dd//select", opt.material);
        }
        if (opt.lengthInCM) {
            await this.page.locator("//label[normalize-space(.)='Length in cm']/ancestor::dt/following-sibling::dd//input[@type='text']").fill(opt.lengthInCM);
        }
        break;
      }

      default:
        throw new Error(`Unhandled product type: ${(options as any).productType}`);
    }
    await this.addToCartBtn.click();
    await expect(this.page.locator('#bar-notification')).toBeVisible();
  }
}
