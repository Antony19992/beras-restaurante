export interface Ingredient {
  id: number;           // Identificador do ingrediente
  idItem: number;      // Referência ao item do cardápio
  descricao: string;    // Descrição do ingrediente
  ativo: boolean;       // Indica se o ingrediente está ativo
  removable: boolean;  // Indica se o ingrediente pode ser removido
  createdAt: string;    // Data de criação
  updatedAt: string;    // Data de atualização
  selected: boolean; // Indicates if the ingredient is selected
}
