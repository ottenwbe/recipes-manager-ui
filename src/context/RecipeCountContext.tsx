/**
 * RecipeCountContext — shares recipe count state and refresh callback
 * between AppShell (owner) and feature components (consumers).
 *
 * This solves the problem where deleting/adding a recipe needs to
 * update the badge in the drawer, but the count state lives in AppShell.
 */

import { createContext, useContext } from 'react';

export interface RecipeCountContextValue {
  count: number;
  refresh: () => void;
}

export const RecipeCountContext = createContext<RecipeCountContextValue>({
  count: 0,
  refresh: () => {},
});

export function useRecipeCount(): RecipeCountContextValue {
  return useContext(RecipeCountContext);
}
