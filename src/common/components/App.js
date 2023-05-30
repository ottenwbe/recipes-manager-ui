import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StorageIcon from '@mui/icons-material/Storage';
import { createTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { ThemeProvider } from 'react-bootstrap';
import {
    HashRouter,
    NavLink,
    Navigate,
    Route,
    Routes,
    useNavigate
} from "react-router-dom";
import { Home } from './Home';
import { NotFoundPage } from './NotFoundPage';
import { RecipeForm } from './RecipeForm';
import { RandomRecipe, Recipes } from './Recipes';
import { Sources } from './Sources';
import { TextContextComponent } from '../context/TextContextProvider';
import { TextContext } from '../context/TextContext';
import pkg from '../../../package.json'
import { AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Footer } from './Footer';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `${drawerWidth}px`,
        ...(!open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const StyledDrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function RecipesApp(props) {

    const [numRecipes, setNumRecipes] = React.useState(0);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const updatNumRecipes = () => {
        fetch('/api/v1/recipes/num')
            .then(response => response.json())
            .then(responseText => setNumRecipes(responseText))
            .catch(error => console.log(error));
    }

    React.useEffect(() => {
        updatNumRecipes();
    });

    const handleRecipeCountChange = () => {
        updatNumRecipes();
    }

    const handleDrawerOpen = () => {
        setMenuOpen(true);
    };

    const handleDrawerClose = () => {
        setMenuOpen(false);
    };

    return (
        <HashRouter>
            <RecipesDrawer open={menuOpen} numRecipes={numRecipes} handleDrawerClose={handleDrawerClose} />
            <RecipesAppHeader open={menuOpen} numRecipes={numRecipes} handleDrawerOpen={handleDrawerOpen} />
            <RecipesAppBody open={menuOpen} onRecipeCountChange={handleRecipeCountChange} />
        </HashRouter>
    );
}


const theme = createTheme(
    {
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f50057',
        },
    },
);

function RecipesAppHeader(props) {

    //const classes = useStyles();

    const [searchTerm, setSearchTerm] = React.useState("");

    let navigate = useNavigate();

    const handleSearchClick = () => {
        navigate({
            pathname: '/recipes',
            search: searchTerm !== '' ? '?search=' + searchTerm : ''
        });
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick()
        }
    }

    return (
        <div className="RecipesRouterMenu">
            <ThemeProvider theme={theme}>
                <StyledAppBar open={props.open} style={{ backgroundColor: "#2196f3" }} position="fixed"
                    /*className={clsx(classes.appBar, {
                        [classes.appBarShift]: props.open,
                    })}*/>
                    <Toolbar>
                        {props.open ? '' : <IconButton  /*className={clsx(classes.menuButton, props.open && classes.hide)}*/
                            color="inherit"
                            aria-label="Menu"
                            onClick={props.handleDrawerOpen}>
                            <MenuIcon />
                        </IconButton>}
                        <div style={{ flexGrow: 1, }} />
                        <OutlinedInput
                            fullWidth
                            id="search-input"
                            variant="outlined"
                            placeholder="Search for recipes"
                            onChange={handleSearchTermChange}
                            onKeyPress={handleKeyPress}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearchClick}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Toolbar>
                </StyledAppBar>
            </ThemeProvider>
        </div>
    );
}

function RecipesAppBody(props) {

    //const classes = useStyles();

    const handleRecipeChange = () => {
        props.onRecipeCountChange();
    }

    //{ flexGrow: 1, align: 'center' }    
    return (<Container maxWidth="xl">
        <Main open={props.open}>
            <React.Fragment /*className={classes.drawerHeader}*/ />
            <Routes>
                <Route exact path="/" element={<Navigate to="/recipes" />} />
                <Route path="/news" element={<Home />} />
                <Route exact path="/recipes" element={<Recipes onRecipesChange={handleRecipeChange} />} />
                <Route path="/recipes/:recipe" element={<Recipes onRecipesChange={handleRecipeChange} />} />
                <Route path="/add" element={<RecipeForm onRecipesChange={handleRecipeChange} />} />
                <Route path="/rand" element={<RandomRecipe />} />
                <Route path="/src" element={<Sources />} />
                <Route path="/login" element={<Home />} />
                <Route path="/health" element={<div style={{ textAlign: 'center' }}>I am Up</div>}></Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </Main>
    </Container>);
}

function RecipesDrawer(props) {
    //const classes = useStyles();

    const texts = useContext(TextContext)

    const selectedItem = (hashName) => {
        return window.location.hash === hashName ? true : false;
    }

    return (
        <Drawer
            //className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.open}
            onClose={props.handleDrawerClose}

            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        /*classes={{
            paper: classes.drawerPaper,
        }}*/
        >
            <StyledDrawerHeader>
                <Typography variant="h6" color="inherit">
                    <TextContextComponent value='appName' />

                    <IconButton onClick={props.handleDrawerClose} >
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>

                </Typography>
            </StyledDrawerHeader>

            <Divider />
            <List>
                <NavLink to="/recipes" style={{ color: '#505050', textDecoration: 'none' }}>
                    <ListItemButton key="My Recipes" selected={selectedItem('#/recipes')}>
                        <ListItemIcon>
                            <LocalDiningIcon style={{ color: '#505050' }} />
                        </ListItemIcon>
                        <Badge badgeContent={props.numRecipes} color="secondary">
                            <ListItemText primary="My Recipes      " />
                        </Badge>
                    </ListItemButton>

                </NavLink>
                <NavLink to="/rand" style={{ color: '#505050', textDecoration: 'none' }}>
                    <ListItemButton key="Random Recipes" selected={selectedItem('#/rand')}>
                        <ListItemIcon />
                        <ListItemText primary="Random Recipes" />
                    </ListItemButton>
                </NavLink>
                <NavLink to="/add" style={{ color: '#505050', textDecoration: 'none' }}>
                    <ListItemButton key="Add Recipes" selected={selectedItem('#/add')}>
                        <ListItemIcon />
                        <ListItemText primary="Add Recipes" />
                    </ListItemButton>
                </NavLink>
                <Divider />
                <NavLink to="/src" style={{ color: '#505050', textDecoration: 'none' }}>
                    <ListItemButton key="Sources" selected={selectedItem('#/sources')}>
                        <ListItemIcon><StorageIcon style={{ color: '#505050' }} /></ListItemIcon>
                        <ListItemText primary="Recipe Sources" />
                    </ListItemButton>
                </NavLink>
                <Divider />
                <NavLink to="/news" style={{ color: '#505050', textDecoration: 'none' }}>
                    <ListItemButton key="News" selected={selectedItem('#/news')}>
                        <ListItemIcon><HomeIcon style={{ color: '#505050' }} /></ListItemIcon>
                        <ListItemText primary="News" />
                    </ListItemButton>
                </NavLink>
                {/* <NavLink to="/account" style={{ color: '#505050', textDecoration: 'none' }}> */}
                <ListItemButton disabled key="Account" selected={selectedItem('#/account')}>
                    <ListItemIcon><AccountCircle style={{ color: '#505050' }} /></ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItemButton>
                {/* </NavLink>                 */}
                <p />
                <Divider variant='middle' />
                <div style={{ textAlign: 'center' }} >
                    {pkg.version}
                </div>
            </List>

        </Drawer>
    );
}

//const drawerWidth = 240;

/*const useStyles = makeStyles((theme) => ({
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
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    recipesContent: {
        flexGrow: 1,
        padding: theme.spacing(3),
        align: 'center'
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
*/

function App(props) {

    return (
        <RecipesApp />
    );
}

export default App;
