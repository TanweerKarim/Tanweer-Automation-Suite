export interface CategoryProduct {
    productName: string;
    productType: string;
    qty: number;
  }
  
  export interface Category {
    categoryName: string;
    products: CategoryProduct[];
  }
  
  export interface CategoryData {
    categories: Category[];
  }
  