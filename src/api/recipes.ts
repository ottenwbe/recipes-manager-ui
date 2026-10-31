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
 * Lightweight runtime validators for API responses.
 * These provide basic shape checking beyond TypeScript's compile-time casts.
 */

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function validateRecipe(data: unknown): void {
  if (!isObject(data)) {
    throw new Error('Expected Recipe object, got: ' + typeof data);
  }
  if (typeof data.id !== 'string') {
    throw new Error('Recipe.id must be a string');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Recipe.name must be a string');
  }
  if (!Array.isArray(data.components)) {
    throw new Error('Recipe.components must be an array');
  }
}

function validateRecipesResponse(data: unknown): void {
  if (!isObject(data) || !Array.isArray(data.recipes)) {
    throw new Error('Expected { recipes: string[] } response');
  }
  if (!data.recipes.every((r: unknown) => typeof r === 'string')) {
    throw new Error('All recipe IDs must be strings');
  }
}

/**
 * Check if response is OK, parse JSON, and optionally validate the shape.
 * The generic T provides compile-time typing; the validator provides runtime checking.
 */
async function checkResponse<T>(response: Response, validator?: (data: unknown) => void): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  const data: unknown = await response.json();
  if (validator) {
    validator(data);
  }
  return data as T;
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
    const data = await checkResponse<RecipesResponse>(response, validateRecipesResponse);
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
    const data = await checkResponse<RecipesResponse>(response, validateRecipesResponse);
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
    return await checkResponse<Recipe>(response, validateRecipe);
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
    const data = await checkResponse<SimilarRecipesResponse>(response, validateRecipesResponse);
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
    return await checkResponse<Recipe>(response, validateRecipe);
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
 * Recipe picture response: { id, name, picture }
 * (Go: RecipePicture struct with json tags)
 */
export interface RecipePictureResponse {
  id: string;
  name: string;
  picture: string;
}

/**
 * Get a recipe picture metadata.
 * GET /api/v1/recipes/r/:id/pictures/:name → { id, name, picture } JSON
 */
export async function getRecipePicture(recipeId: string, pictureId: string): Promise<RecipePictureResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/r/${recipeId}/pictures/${pictureId}/`);
    return await checkResponse<RecipePictureResponse>(response);
  } catch (error) {
    return handleApiError(error);
  }
}
