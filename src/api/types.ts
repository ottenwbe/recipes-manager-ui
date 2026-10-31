/**
 * API Types for Recipes Manager — single source of truth for API contracts.
 *
 * These types mirror the actual backend API:
 * - Go backend (recipes-manager): /api/v1/recipes/*
 * - Python recommender: /api/v1/recommendation/*
 *
 * Verified against:
 * - recipes-manager/recipes/recipes_api.go
 * - recipes-manager/recipes/recipes_model.go
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

// NOTE: GET /api/v1/recipes/r/:id returns Recipe directly (c.JSON(200, recipe))
// NOTE: GET /api/v1/recipes/rand returns Recipe directly (c.JSON(200, recipe))
// NOTE: GET /api/v1/recipes/num returns bare number as string (c.String)

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
