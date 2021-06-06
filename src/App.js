import { createMuiTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import StorageIcon from '@material-ui/icons/Storage';
import clsx from 'clsx';
import React, { Component } from 'react';
import { ThemeProvider } from 'react-bootstrap';
import {
    HashRouter,
    NavLink,
    Redirect, 
    Route,
    Switch
} from "react-router-dom";
import './App.css';
import { Footer } from './Footer';
import { Home } from './Home';
import { NotFoundPage } from './NotFoundPage';
import { RecipeForm } from './RecipeForm';
import { RandomRecipe, Recipes } from './Recipes';
import { Sources } from './Sources';

const { REACT_APP_APP_NAME } = process.env;

class RecipesRouter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numRecipes: 0,
            open: false
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

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (<HashRouter>
            <RecipesDrawer open={this.state.open} numRecipes={this.state.numRecipes} handleDrawerClose={this.handleDrawerClose} />
            <RecipesRouterMenu open={this.state.open} numRecipes={this.state.numRecipes} handleDrawerOpen={this.handleDrawerOpen} />
            <RecipesRouterBody open={this.state.open} onRecipeCountChange={this.handleRecipeCountChange} />
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

    const classes = useStyles();

    const [searchTerm, setSearchTerm] = React.useState("");

    const handleSearchClick = () => {
        window.location.href = "/#/recipes?search=" + searchTerm;
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleKeyClick = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick()
        }
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <AppBar style={{ backgroundColor: "#2196f3" }} position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: props.open,
                    })}>
                    <Toolbar>
                        <IconButton className={clsx(classes.menuButton, props.open && classes.hide)}
                            color="inherit"
                            aria-label="Menu"
                            onClick={props.handleDrawerOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            {REACT_APP_APP_NAME}
                        </Typography>
                        <div style={{ flexGrow: 1, }} />
                        <OutlinedInput
                            fullWidth
                            id="search-input"
                            variant="outlined"
                            placeholder="Search for recipes"
                            onChange={handleSearchTermChange}
                            onKeyPress={handleKeyClick}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearchClick}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />                        
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </div>
    );
    //<NavLink to="/recipes"><Badge badgeContent={props.numRecipes} color="secondary"><Button>My Recipes</Button></Badge></NavLink>
    //<NavLink to="/add"><Button>Add Recipes</Button></NavLink>
    //<NavLink to="/rand"><Button>Random Recipes</Button></NavLink>
    //<NavLink disabled to="/login"><Button disabled>Login</Button></NavLink>
}

function RecipesRouterBody(props) {

    const classes = useStyles();

    const handleRecipeChange = () => {
        props.onRecipeCountChange();
    }

    return (<div className="GoCookUIContent" style={{ align: 'center' }}> 
        <main className={clsx(classes.content, {
            [classes.contentShift]: !props.open,
        })}>
            <div className={classes.drawerHeader} />
            <CssBaseline />
            <Switch>
                <Route exact path="/" ><Redirect to="/recipes" /></Route>
                <Route path="/news" component={Home} />
                <Route exact path="/recipes" render={(props) => (<Recipes {...props} onRecipesChange={handleRecipeChange} />)} />
                <Route path="/recipes/:recipe" render={(props) => (<Recipes {...props} onRecipesChange={handleRecipeChange} />)} />
                <Route path="/add" render={(props) => (<RecipeForm {...props} onRecipesChange={handleRecipeChange} />)} />
                <Route path="/rand" component={RandomRecipe} />
                <Route path="/src" component={Sources} />
                <Route path="/login" component={Home} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
            <div></div>
        </main>
        <Footer />
    </div>);
}

function RecipesDrawer(props) {
    const classes = useStyles();

    const selectedItem = (hashName) => {
        return window.location.hash === hashName ? true : false;
    }

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.open}
            onClose={props.handleDrawerClose}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div onClick={props.handleDrawerClose}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={props.handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <NavLink to="/recipes" style={{ color: '#505050', textDecoration: 'none' }}>
                        <ListItem button key="My Recipes" selected={selectedItem('#/recipes')}>
                            <ListItemIcon>
                                <LocalDiningIcon style={{ color: '#505050' }} />
                            </ListItemIcon>
                            <Badge badgeContent={props.numRecipes} color="secondary">
                                <ListItemText primary="My Recipes      " />
                            </Badge>
                        </ListItem>

                    </NavLink>
                    <NavLink to="/rand" style={{ color: '#505050', textDecoration: 'none' }}>
                        <ListItem button key="Random Recipes" selected={selectedItem('#/rand')}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary="Random Recipes" />
                        </ListItem>
                    </NavLink>
                    <NavLink to="/add" style={{ color: '#505050', textDecoration: 'none' }}>
                        <ListItem button key="Add Recipes" selected={selectedItem('#/add')}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary="Add Recipes" />
                        </ListItem>
                    </NavLink>
                    <Divider />
                    <NavLink to="/src" style={{ color: '#505050', textDecoration: 'none' }}>
                        <ListItem button key="Sources" selected={selectedItem('#/sources')}>
                            <ListItemIcon><StorageIcon style={{ color: '#505050' }} /></ListItemIcon>
                            <ListItemText primary="Recipe Sources" />
                        </ListItem>
                    </NavLink>
                    <Divider />
                    <NavLink to="/news" style={{ color: '#505050', textDecoration: 'none' }}>
                        <ListItem button key="News" selected={selectedItem('#/news')}>
                            <ListItemIcon><HomeIcon style={{ color: '#505050' }} /></ListItemIcon>
                            <ListItemText primary="News" />
                        </ListItem>
                    </NavLink>
                </List>
            </div>
        </Drawer>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

function App() {

    return (
        <div>
            <RecipesRouter />
        </div>
    );
}

export default App;
