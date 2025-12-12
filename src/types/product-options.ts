export type ProductType = 'book' | 'gift-card' | 'laptop' | 'computer' | 'apparel and shoes' | 'jewelry';

export interface BaseOptions {
  productName: string;
  productType: ProductType;
  qty?: number;
}

export interface GiftCardOptions extends BaseOptions {
  productType: 'gift-card';
  recipientName: string;
  recipientEmail: string;
  message?: string;
}

export interface LaptopOptions extends BaseOptions {
  productType: 'laptop';
  // no special options
}

export interface BookOptions extends BaseOptions {
    productType: 'book';
    // no special options
  }

export interface ComputerOptions extends BaseOptions {
  productType: 'computer';
  processor?: string;        
  ram?: string;              
  hdd?: string;              
  software?: string[];    
}

export interface ApparelOptions extends BaseOptions {
  productType: 'apparel and shoes';
  size?: string;         
  color?: string;          
}

export interface JewelryOptions extends BaseOptions {
  productType: 'jewelry';
  material?: string;
  lengthInCM?: string;
}

export type ProductOptions =
  | GiftCardOptions
  | LaptopOptions
  | ComputerOptions
  | ApparelOptions
  | JewelryOptions
  | BookOptions;
