/**
 * API Types for Recipes Manager
 * 
 * This module contains TypeScript interfaces for API responses.
 * Add runtime validation (e.g., Zod) here for production use.
 */

// ============================================================================
// Recipe Types
// ============================================================================

export interface RecipeComponent {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipePictureLink {
  id: string;
  picture: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  components: RecipeComponent[];
  pictureLink: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface RecipesResponse {
  recipes: string[]; // Array of recipe IDs
}

export interface RecipeResponse {
  recipe: Recipe;
}

export interface RecipeCountResponse {
  count: number;
}

export interface SimilarRecipesResponse {
  recipes: string[];
}

export interface RandomRecipeResponse {
  id: string;
}

// ============================================================================
// Request Parameters
// ============================================================================

export interface RecipeSearchParams {
  name?: string;
  description?: string;
  servings?: number;
}

export interface RecipePictureParams {
  recipeId: string;
  pictureId: string;
}
