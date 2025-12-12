export type CountryState = {
    country: string; 
    state?: string;  
  };
  
  export interface Address {
    country: string;
    state?: string;
    city: string;
    address1: string;
    address2?: string;
    zipPostalCode: string;
    phoneNumber?: string;
    faxNumber?: string;
  }
  
  export interface BillingSection {
    useNewAddress: boolean;
    address?: Address; 
  }
  
  export interface ShippingSection {
    inStorePickup?: boolean; 
    useNewAddress?: boolean; 
    address?: Address;       
  }
  
  export type ShippingMethod = 'Ground' | 'Next Day Air' | '2nd Day Air';
  
  export type PaymentMethodType = 'COD' | 'CheckMoneyOrder' | 'CreditCard' | 'PurchaseOrder';
  
  export interface PaymentInfo_COD {
    type: 'COD';
  }
  
  export interface PaymentInfo_Check {
    type: 'CheckMoneyOrder';
  }
  
  export interface PaymentInfo_CreditCard {
    type: 'CreditCard';
    cardType: string;   
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string | number; 
    expireYear: string | number; 
    cardCode: string;    
  }
  
  export interface PaymentInfo_PO {
    type: 'PurchaseOrder';
    poNumber: string;
  }
  
  export type PaymentInfo = PaymentInfo_COD | PaymentInfo_Check | PaymentInfo_CreditCard | PaymentInfo_PO;
  
  export interface CheckoutOptions {
    billing: BillingSection;
    shipping: ShippingSection;
    shippingMethod: ShippingMethod;
    payment: PaymentInfo;
    confirmOrder?: boolean;
  }
  