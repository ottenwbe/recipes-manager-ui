/**
 * API Functions for Recipes
 *
 * Typed wrappers around the Recipes Manager backend API.
 * Response shapes verified against:
 * - Go backend: recipes-manager/recipes/recipes_api.go
 * - Python recommender: recipes-manager-recommender/analyzer/
 */

import type {
  Recipe,
  RecipesResponse,
  SimilarRecipesResponse,
  RecipeSearchParams,
} from './types';

// ============================================================================
// Base API Configuration
// ============================================================================

const API_BASE_URL = '/api/v1';

/**
 * Handle API errors consistently
 */
function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    throw new Error(`API request failed: ${error.message}`);
  }
  console.error('API Error:', error);
  throw new Error('API request failed with unknown error');
}

/**
 * Check if response is OK and parse JSON
 */
async function checkResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json() as Promise<T>;
}

// ============================================================================
// Recipe API Functions
// ============================================================================

/**
 * Get all recipe IDs.
 * GET /api/v1/recipes → { recipes: string[] }
 */
export async function getAllRecipes(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    const data = await checkResponse<RecipesResponse>(response);
    return data.recipes;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Search recipes by name and/or description.
 * GET /api/v1/recipes?name=...&description=... → { recipes: string[] }
 */
export async function searchRecipes(params: RecipeSearchParams): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (params.name) {
    queryParams.append('name', params.name);
  }
  if (params.description) {
    queryParams.append('description', params.description);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/recipes${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url);
    const data = await checkResponse<RecipesResponse>(response);
    return data.recipes;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get a single recipe by ID.
 * GET /api/v1/recipes/r/:id → Recipe object directly (no envelope)
 */
export async function getRecipeById(recipeId: string, servings?: number): Promise<Recipe> {
  let url = `${API_BASE_URL}/recipes/r/${recipeId}`;

  if (servings !== undefined && servings > 0) {
    url += `?servings=${servings}`;
  }

  try {
    const response = await fetch(url);
    return await checkResponse<Recipe>(response);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get the total number of recipes.
 * GET /api/v1/recipes/num → bare number returned as string (c.String in Go)
 */
export async function getRecipeCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/num`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    // Backend returns c.String(200, "42") — a bare number as text
    const text = await response.text();
    const count = parseInt(text, 10);
    if (isNaN(count)) {
      throw new Error(`Invalid recipe count response: "${text}"`);
    }
    return count;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get similar recipes to a given recipe.
 * GET /api/v1/recommendation/:id/components → { recipes: string[] }
 */
export async function getSimilarRecipes(recipeId: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendation/${recipeId}/components`);
    const data = await checkResponse<SimilarRecipesResponse>(response);
    return data.recipes;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get a random recipe.
 * GET /api/v1/recipes/rand → Recipe object directly (no envelope)
 */
export async function getRandomRecipe(): Promise<Recipe> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/rand`);
    return await checkResponse<Recipe>(response);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Delete a recipe by ID.
 * DELETE /api/v1/recipes/r/:id → 200 on success
 */
export async function deleteRecipe(recipeId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/r/${recipeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to delete recipe: HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get a recipe picture.
 * GET /api/v1/recipes/r/:id/pictures/:name → image blob
 */
export async function getRecipePicture(recipeId: string, pictureId: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/r/${recipeId}/pictures/${pictureId}/`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to get picture: HTTP ${response.status}: ${errorText}`);
    }

    return response.blob();
  } catch (error) {
    return handleApiError(error);
  }
}
