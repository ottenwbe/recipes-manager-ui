/**
 * API Types for Recipes Manager
 *
 * These types mirror the actual backend API contracts:
 * - Go backend (recipes-manager): /api/v1/recipes/*
 * - Python recommender: /api/v1/recommendation/*
 *
 * Verified against:
 * - recipes-manager/recipes/recipes_api.go
 * - recipes-manager-recommender/analyzer/controller.py
 */

// ============================================================================
// Recipe Types (matches Go Recipe struct JSON serialization)
// ============================================================================

export interface RecipeComponent {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  components: RecipeComponent[];
  pictureLink: string[];
}

// ============================================================================
// API Response Types (actual backend response shapes)
// ============================================================================

/**
 * GET /api/v1/recipes → { recipes: string[] }
 * (Go: RecipeList struct with json:"recipes")
 */
export interface RecipesResponse {
  recipes: string[];
}

/**
 * GET /api/v1/recommendation/:id/components → { recipes: string[] }
 * (Python: {"recipes": [...]})
 */
export interface SimilarRecipesResponse {
  recipes: string[];
}

// NOTE: GET /api/v1/recipes/r/:id returns the Recipe object directly (no envelope)
// NOTE: GET /api/v1/recipes/rand returns the Recipe object directly (no envelope)
// NOTE: GET /api/v1/recipes/num returns a bare number as a string (c.String)

// ============================================================================
// Request Parameters
// ============================================================================

export interface RecipeSearchParams {
  name?: string;
  description?: string;
}

export interface RecipePictureParams {
  recipeId: string;
  pictureId: string;
}
