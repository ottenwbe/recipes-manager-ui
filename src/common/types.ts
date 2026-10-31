export type RecipeId = number | string;

export interface Ingredient {
    id?: RecipeId;
    name: string;
    amount: number;
    unit: string;
}

export interface Recipe {
    id?: RecipeId;
    name: string;
    servings: number;
    description: string;
    components: Ingredient[];
    pictureLink?: string[] | null;
}

export interface RecipePicture {
    picture: string;
}

export interface RecipeSource {
    id: RecipeId;
    name: string;
    connected: boolean;
}