export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: number;
  name: string;
  removable: boolean;
  selected: boolean;
}

export interface CartMenuItem extends MenuItem {
  quantity: number;
  removedIngredients?: string[];
  observations?: string;
}
