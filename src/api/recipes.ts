/**
 * API Functions for Recipes
 * 
 * This module provides typed API functions for recipe operations.
 * All functions include error handling and return consistent types.
 */

import type {
  Recipe,
  RecipesResponse,
  RecipeResponse,
  RecipeCountResponse,
  SimilarRecipesResponse,
  RandomRecipeResponse,
  RecipeSearchParams,
} from './types';

// ============================================================================
// Base API Configuration
// ============================================================================

const API_BASE_URL = '/api/v1';

/**
 * Helper to handle API errors consistently
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
 * Helper to check if response is OK
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
 * Get all recipe IDs
 */
export async function getAllRecipeIds(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    const data = await checkResponse<RecipesResponse>(response);
    return data.recipes;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Search recipes by name and/or description
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
 * Get a single recipe by ID
 */
export async function getRecipeById(recipeId: string, servings?: number): Promise<Recipe> {
  let url = `${API_BASE_URL}/recipes/r/${recipeId}`;
  
  if (servings !== undefined) {
    url += `?servings=${servings}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await checkResponse<RecipeResponse>(response);
    return data.recipe;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get the total number of recipes
 */
export async function getRecipeCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/num`);
    const data = await checkResponse<RecipeCountResponse>(response);
    return data.count;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get similar recipes to a given recipe
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
 * Get a random recipe
 */
export async function getRandomRecipe(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/rand`);
    const data = await checkResponse<RandomRecipeResponse>(response);
    return data.id;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Delete a recipe by ID
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

// ============================================================================
// Recipe Picture API Functions
// ============================================================================

/**
 * Get a recipe picture
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
