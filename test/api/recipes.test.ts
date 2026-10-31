/**
 * Unit tests for the API module (src/api/recipes.ts)
 *
 * These tests verify that the API functions correctly handle the
 * actual backend response shapes (verified against Go/Python source).
 */

import {
  getAllRecipes,
  searchRecipes,
  getRecipeById,
  getRecipeCount,
  getSimilarRecipes,
  getRandomRecipe,
  deleteRecipe,
  getRecipePicture,
} from '../../src/api/recipes';

// ============================================================================
// Test Setup
// ============================================================================

const originalFetch = global.fetch;

function mockFetch(response: Partial<Response> | ((url: string, init?: RequestInit) => Partial<Response>)) {
  global.fetch = jest.fn((url: string | URL | Request, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    const res = typeof response === 'function' ? response(urlStr, init) : response;
    return Promise.resolve(res as Response);
  }) as jest.Mock;
}

function jsonResponse(body: unknown, ok = true, status = 200): Partial<Response> {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
    blob: () => Promise.resolve(new Blob([JSON.stringify(body)])),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

// ============================================================================
// getAllRecipes
// ============================================================================

describe('getAllRecipes', () => {
  it('returns recipe IDs from { recipes: string[] }', async () => {
    mockFetch(jsonResponse({ recipes: ['id1', 'id2', 'id3'] }));

    const result = await getAllRecipes();

    expect(result).toEqual(['id1', 'id2', 'id3']);
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/recipes');
  });

  it('throws on HTTP error', async () => {
    mockFetch(jsonResponse('Server Error', false, 500));

    await expect(getAllRecipes()).rejects.toThrow('HTTP 500');
  });
});

// ============================================================================
// searchRecipes
// ============================================================================

describe('searchRecipes', () => {
  it('builds correct query string with name and description', async () => {
    mockFetch(jsonResponse({ recipes: ['id1'] }));

    await searchRecipes({ name: 'pasta', description: 'italian' });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('name=pasta');
    expect(calledUrl).toContain('description=italian');
  });

  it('omits empty params', async () => {
    mockFetch(jsonResponse({ recipes: [] }));

    await searchRecipes({ name: 'soup' });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('name=soup');
    expect(calledUrl).not.toContain('description=');
  });
});

// ============================================================================
// getRecipeById — returns Recipe directly (NO envelope)
// ============================================================================

describe('getRecipeById', () => {
  const mockRecipe = {
    id: 'abc123',
    name: 'Pasta',
    description: 'Delicious pasta',
    servings: 4,
    components: [{ name: 'pasta', amount: 500, unit: 'g' }],
    pictureLink: [],
  };

  it('returns the Recipe object directly (not wrapped in { recipe })', async () => {
    // Backend: c.JSON(200, recipe) — direct Recipe, no envelope
    mockFetch(jsonResponse(mockRecipe));

    const result = await getRecipeById('abc123');

    expect(result).toEqual(mockRecipe);
    expect(result.id).toBe('abc123');
    expect(result.name).toBe('Pasta');
  });

  it('appends servings query param when provided', async () => {
    mockFetch(jsonResponse(mockRecipe));

    await getRecipeById('abc123', 8);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toBe('/api/v1/recipes/r/abc123?servings=8');
  });

  it('does not append servings when 0 or undefined', async () => {
    mockFetch(jsonResponse(mockRecipe));

    await getRecipeById('abc123');

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toBe('/api/v1/recipes/r/abc123');
  });
});

// ============================================================================
// getRecipeCount — returns bare number as text (c.String in Go)
// ============================================================================

describe('getRecipeCount', () => {
  it('parses bare number string response (NOT { count: number })', async () => {
    // Backend: c.String(200, "42") — bare number as string, not JSON object
    mockFetch({
      ok: true,
      status: 200,
      text: () => Promise.resolve('42'),
      json: () => Promise.resolve(42), // would be wrong shape but text() is what we use
    });

    const result = await getRecipeCount();

    expect(result).toBe(42);
    expect(typeof result).toBe('number');
  });

  it('handles zero count', async () => {
    mockFetch({
      ok: true,
      status: 200,
      text: () => Promise.resolve('0'),
    });

    const result = await getRecipeCount();
    expect(result).toBe(0);
  });

  it('throws on non-numeric response', async () => {
    mockFetch({
      ok: true,
      status: 200,
      text: () => Promise.resolve('not-a-number'),
    });

    await expect(getRecipeCount()).rejects.toThrow('Invalid recipe count');
  });

  it('throws on HTTP error', async () => {
    mockFetch({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });

    await expect(getRecipeCount()).rejects.toThrow('HTTP 500');
  });
});

// ============================================================================
// getSimilarRecipes
// ============================================================================

describe('getSimilarRecipes', () => {
  it('returns recipe IDs from recommendation endpoint', async () => {
    mockFetch(jsonResponse({ recipes: ['sim1', 'sim2'] }));

    const result = await getSimilarRecipes('abc123');

    expect(result).toEqual(['sim1', 'sim2']);
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/recommendation/abc123/components');
  });
});

// ============================================================================
// getRandomRecipe — returns Recipe directly (NO envelope)
// ============================================================================

describe('getRandomRecipe', () => {
  it('returns the full Recipe object directly (not { id })', async () => {
    const mockRecipe = {
      id: 'rand1',
      name: 'Random Dish',
      description: 'Surprise!',
      servings: 2,
      components: [],
      pictureLink: [],
    };
    // Backend: c.JSON(200, recipe) — direct Recipe object
    mockFetch(jsonResponse(mockRecipe));

    const result = await getRandomRecipe();

    expect(result).toEqual(mockRecipe);
    expect(result.id).toBe('rand1');
  });
});

// ============================================================================
// deleteRecipe
// ============================================================================

describe('deleteRecipe', () => {
  it('sends DELETE request to correct URL', async () => {
    mockFetch(jsonResponse({}, true, 200));

    await deleteRecipe('abc123');

    expect(global.fetch).toHaveBeenCalledWith('/api/v1/recipes/r/abc123', { method: 'DELETE' });
  });

  it('throws on HTTP error', async () => {
    mockFetch(jsonResponse('Not found', false, 404));

    await expect(deleteRecipe('abc123')).rejects.toThrow('HTTP 404');
  });
});

// ============================================================================
// getRecipePicture
// ============================================================================

describe('getRecipePicture', () => {
  it('returns picture metadata JSON { id, name, picture }', async () => {
    mockFetch(jsonResponse({ id: 'abc123', name: 'pic1', picture: 'data:image/png;base64,...' }));

    const result = await getRecipePicture('abc123', 'pic1');

    expect(result).toEqual({ id: 'abc123', name: 'pic1', picture: 'data:image/png;base64,...' });
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/recipes/r/abc123/pictures/pic1/');
  });
});

// ============================================================================
// Runtime validation tests — malformed payloads should throw
// ============================================================================

describe('runtime validation', () => {
  it('getRecipeById throws on malformed recipe (missing id)', async () => {
    mockFetch(jsonResponse({ name: 'No ID' }));

    await expect(getRecipeById('abc123')).rejects.toThrow('Recipe.id must be a string');
  });

  it('getRecipeById throws on non-object response', async () => {
    mockFetch(jsonResponse('just a string'));

    await expect(getRecipeById('abc123')).rejects.toThrow('Expected Recipe object');
  });

  it('getAllRecipes throws when recipes is not an array', async () => {
    mockFetch(jsonResponse({ recipes: 'not-an-array' }));

    await expect(getAllRecipes()).rejects.toThrow('Expected { recipes: string[] }');
  });

  it('getAllRecipes throws when recipe IDs are not strings', async () => {
    mockFetch(jsonResponse({ recipes: [123, 456] }));

    await expect(getAllRecipes()).rejects.toThrow('All recipe IDs must be strings');
  });
});
