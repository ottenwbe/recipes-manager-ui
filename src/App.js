import React, { Component } from 'react';
import './App.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import CssBaseline from '@material-ui/core/CssBaseline'
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import Badge from '@material-ui/core/Badge';
import {
    Route,
    NavLink,
    HashRouter,
} from "react-router-dom";

import { Recipes, RandomRecipe } from './Recipes';
import { Home } from './Home';
import { Footer } from './Footer';
import { Sources } from './Sources';
import { RecipeForm } from './RecipeForm';
import { ThemeProvider } from 'react-bootstrap';
import { createMuiTheme } from '@material-ui/core';

const { REACT_APP_APP_NAME } = process.env;

class RecipesRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numRecipes: 0,
        };
    }

    updateRecipes = () => {
        fetch('/api/v1/recipes/num')
            .then(response => response.json())
            .then(responseText => this.setState({ numRecipes: responseText }))
            .catch(error => console.log(error));
    }

    handleRecipeCountChange = () => {
        this.updateRecipes()
    }

    componentDidMount() {
        this.updateRecipes()
    }

    render() {
        return (<HashRouter>
            <RecipesRouterMenu numRecipes={this.state.numRecipes} />
            <RecipesRouterBody onRecipeCountChange={this.handleRecipeCountChange} />
        </HashRouter>);
    }
}

const theme = createMuiTheme(
    {
            primary: {
                main: '#90caf9',
            },
            secondary: {
                main: '#f50057',
            },
        },
);

function RecipesRouterMenu(props) {

    const [searchTerm, setSearchTerm] = React.useState("");

    const handleSearchClick = () => {
        window.location.href = "/#/recipes?search=" + searchTerm;
        window.location.reload()
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value)
    }

    return (
        <div>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <AppBar style={{ backgroundColor: "#2196f3" }} className="RecipeMenu" position="fixed">
                    <Toolbar>
                        <IconButton className="menu-icon" color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            {REACT_APP_APP_NAME}
                        </Typography>
                        <NavLink to="/"><Button><HomeIcon />News</Button></NavLink>
                        <NavLink to="/recipes">
                            <Badge badgeContent={props.numRecipes} color="secondary">
                                <Button>Recipes</Button>
                            </Badge>
                        </NavLink>
                        <NavLink to="/add"><Button>Add Recipe</Button></NavLink>
                        <NavLink to="/rand"><Button>Random Recipe</Button></NavLink>
                        <NavLink to="/src"><Button>Recipe Sources</Button></NavLink>
                        <div style={{ flexGrow: 1, }} />
                        <OutlinedInput
                            id="search-input"
                            variant="outlined"
                            placeholder="Search for recipes"
                            onChange={handleSearchTermChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearchClick}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <NavLink disabled to="/login"><Button disabled>Login</Button></NavLink>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div>
    );
}

function RecipesRouterBody(props) {

    const handleRecipeChange = () => {
        props.onRecipeCountChange()
    }

    return (<div className="GoCookUIContent" style={{ align: 'center', paddingRight: 50, paddingLeft: 50 }}>
        <div className="GoCookUIRoutes">
            <Route exact path="/" component={Home} />
            <Route exact path="/recipes" render={(props) => (<Recipes {...props} onRecipesChange={handleRecipeChange} />)} />
            <Route path="/recipes/:recipe" render={(props) => (<Recipes {...props} onRecipesChange={handleRecipeChange} />)} />
            <Route path="/add" render={(props) => (<RecipeForm {...props} onRecipesChange={handleRecipeChange} />)} />
            <Route path="/rand" component={RandomRecipe} />
            <Route path="/src" component={Sources} />
            <Route path="/login" component={Home} />
        </div>
        <Footer />
    </div>);
}

function App() {
    return (
        <div className="GoCookUIApp">
            <RecipesRouter />
        </div>
    );
}

export default App;
