export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  ingredients?: Ingredient[];
}

export interface CartMenuItem extends MenuItem {
  quantity: number;
  removedIngredients?: string[];
  observations?: string;
}

export interface Ingredient {
  name: string;
  selected: boolean;
  removable: boolean;
}
