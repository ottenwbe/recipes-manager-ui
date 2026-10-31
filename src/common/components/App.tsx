import { useCallback } from 'react';
import {
    HashRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";
import { Home } from './Home';
import { NotFoundPage } from './NotFoundPage';
import { RecipeForm } from '../../features/recipes/RecipeForm';
import { RandomRecipe, Recipes } from '../../features/recipes/Recipes';
import { Sources } from './Sources';
import { AppShell } from '../../components/AppShell';
import { getRecipeCount } from '../../api/recipes';

function App() {
    // Callback to refresh recipe count when recipes change
    const handleRecipesChange = useCallback(async () => {
        // The shell will handle the actual count refresh
        // This callback is just to trigger re-fetching
        try {
            await getRecipeCount();
        } catch (error) {
            console.error('Failed to refresh recipe count:', error);
        }
    }, []);

    return (
        <HashRouter>
            <AppShell>
                <Routes>
                    <Route path="/" element={<Navigate to="/recipes" />} />
                    <Route path="/news" element={<Home />} />
                    <Route path="/recipes" element={<Recipes onRecipesChange={handleRecipesChange} />} />
                    <Route path="/recipes/:recipe" element={<Recipes onRecipesChange={handleRecipesChange} />} />
                    <Route path="/add" element={<RecipeForm onRecipesChange={handleRecipesChange} />} />
                    <Route path="/rand" element={<RandomRecipe />} />
                    <Route path="/src" element={<Sources />} />
                    <Route path="/login" element={<Home />} />
                    <Route path="/health" element={<div style={{ textAlign: 'center' }}>I am Up</div>} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AppShell>
        </HashRouter>
    );
}

export default App;
