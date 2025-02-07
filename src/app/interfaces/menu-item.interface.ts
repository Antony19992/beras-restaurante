export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  ingredients?: string[];
  removedIngredients?: string[];
  observations?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  removable: boolean;
  selected: boolean;
}

export interface CartMenuItem extends MenuItem {
  quantity: number;
}
