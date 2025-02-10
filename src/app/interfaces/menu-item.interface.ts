import { Ingredient } from "./ingredient.interface";


export interface MenuItem {
  id: number;
  nome: string;
  idImagem: string;
  descricao: string;
  valor: number;
  categoria: string;
  ativo: boolean;
  ingredientes?: Ingredient[];
}

export interface CartMenuItem extends MenuItem {
  quantity: number;
  removedIngredients?: string[];
  observations?: string;
}
