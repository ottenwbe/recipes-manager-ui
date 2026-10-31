/**
 * Shared types for Recipes Manager UI.
 *
 * API contract types (Recipe, RecipeComponent, response shapes) live in
 * src/api/types.ts and are re-exported here for convenience. This file
 * also contains UI-specific types not part of the API contract.
 */

// Re-export API contract types as the single source of truth
export type { RecipeComponent, RecipesResponse, SimilarRecipesResponse } from '../api/types';

// UI Recipe: API Recipe with optional id/pictureLink for not-yet-saved recipes
import type { Recipe as ApiRecipe } from '../api/types';
export interface Recipe extends Omit<ApiRecipe, 'id' | 'pictureLink'> {
  id?: RecipeId;
  pictureLink?: string[] | null;
}

// Ingredient = API RecipeComponent + optional UI-side id (used as React key)
export type Ingredient = import('../api/types').RecipeComponent & { id?: RecipeId };

// Backend uses string IDs (MongoDB ObjectID); number kept for legacy flexibility
export type RecipeId = string | number;

// ============================================================================
// UI-specific types (not part of API contract)
// ============================================================================

export interface RecipePicture {
    picture: string;
}

export interface RecipeSource {
    id: RecipeId;
    name: string;
    connected: boolean;
}
