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

function App() {
    return (
        <HashRouter>
            <AppShell>
                <Routes>
                    <Route path="/" element={<Navigate to="/recipes" />} />
                    <Route path="/news" element={<Home />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipes/:recipe" element={<Recipes />} />
                    <Route path="/add" element={<RecipeForm />} />
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
