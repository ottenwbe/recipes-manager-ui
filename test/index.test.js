
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/common/components/App';

jest.mock('../src/features/recipes/Recipes', () => {
  const React = jest.requireActual('react');
  const { useParams } = jest.requireActual('react-router-dom');

  return {
    Recipes: () => {
      const { recipe } = useParams();
      return React.createElement('div', null, recipe ? `Recipe ${recipe}` : 'Recipes page');
    },
    RandomRecipe: () => React.createElement('div', null, 'Random recipe page'),
  };
});

const originalFetch = global.fetch;

function startAt(path) {
  window.history.replaceState(null, '', `/#${path}`);
}

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve(0),
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  window.history.replaceState(null, '', '/');
});

it('redirects the root route to the recipes page', async () => {
  startAt('/');

  render(<App />);

  expect(await screen.findByText('Recipes page')).toBeInTheDocument();
});

it('renders the recipe detail route', async () => {
  startAt('/recipes/42');

  render(<App />);

  expect(await screen.findByText('Recipe 42')).toBeInTheDocument();
});

it('navigates to search results when Enter is pressed', async () => {
  startAt('/recipes');
  const user = userEvent.setup();

  render(<App />);

  await user.type(screen.getByRole('textbox'), 'tomato');
  await user.keyboard('{Enter}');

  expect(window.location.hash).toBe('#/recipes?search=tomato');
});