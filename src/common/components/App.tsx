import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StorageIcon from '@mui/icons-material/Storage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import { getRecipeCount } from '../../api/recipes';
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
import pkg from '../../../package.json'
import { AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Footer } from './Footer';

const drawerWidth = 240;

interface RecipesAppHeaderProps {
    open: boolean;
    handleDrawerOpen: () => void;
}

interface RecipesAppBodyProps {
    open: boolean;
    onRecipeCountChange: () => void;
}

interface RecipesDrawerProps {
    open: boolean;
    numRecipes: number;
    handleDrawerClose: () => void;
}

interface DrawerListProps {
    numRecipes: number;
}

interface DrawerHeaderProps {
    handleDrawerClose: () => void;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open: boolean }>(
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
})<{ open: boolean }>(({ theme, open }) => ({
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

function RecipesApp() {

    const [numRecipes, setNumRecipes] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    // Fetch recipe count only once on mount
    useEffect(() => {
        const fetchRecipeCount = async () => {
            try {
                const count = await getRecipeCount();
                setNumRecipes(count);
            } catch (error) {
                console.error('Failed to fetch recipe count:', error);
                setNumRecipes(0);
            }
        };
        fetchRecipeCount();
    }, []); // Empty dependency array = runs only on mount

    const handleRecipeCountChange = useCallback(() => {
        const fetchRecipeCount = async () => {
            try {
                const count = await getRecipeCount();
                setNumRecipes(count);
            } catch (error) {
                console.error('Failed to fetch recipe count:', error);
            }
        };
        fetchRecipeCount();
    }, []);

    const handleDrawerOpen = useCallback(() => {
        setMenuOpen(true);
    }, [setMenuOpen]);

    const handleDrawerClose = useCallback(() => {
        setMenuOpen(false);
    }, [setMenuOpen]);

    return (
        <HashRouter>
            <RecipesDrawer open={menuOpen} numRecipes={numRecipes} handleDrawerClose={handleDrawerClose} />
            <RecipesAppHeader open={menuOpen} handleDrawerOpen={handleDrawerOpen} />
            <RecipesAppBody open={menuOpen} onRecipeCountChange={handleRecipeCountChange} />
        </HashRouter>
    );
}


const theme = createTheme({
    palette: {
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

function RecipesAppHeader(props: RecipesAppHeaderProps) {

    //const classes = useStyles();

    const [searchTerm, setSearchTerm] = React.useState("");

    let navigate = useNavigate();

    const handleSearchClick = () => {
        navigate({
            pathname: '/recipes',
            search: searchTerm !== '' ? '?search=' + searchTerm : ''
        });
    }

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
                        <img src={logo} alt="Recipes Manager Logo" style={{ height: '32px', marginRight: '16px' }} />
                        <div style={{ flexGrow: 1, }} />
                        <OutlinedInput
                            fullWidth
                            id="search-input"
                            placeholder="Search for recipes"
                            onChange={handleSearchTermChange}
                            onKeyDown={handleKeyDown}
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

function RecipesAppBody(props: RecipesAppBodyProps) {

    //const classes = useStyles();

    const handleRecipeChange = () => {
        props.onRecipeCountChange();
    }

    //{ flexGrow: 1, align: 'center' }    
    return (<Container maxWidth="xl">
        <Main open={props.open}>
            <React.Fragment /*className={classes.drawerHeader}*/ />
            <Routes>
                <Route path="/" element={<Navigate to="/recipes" />} />
                <Route path="/news" element={<Home />} />
                <Route path="/recipes" element={<Recipes onRecipesChange={handleRecipeChange} />} />
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

function RecipesDrawer(props: RecipesDrawerProps) {
    //const classes = useStyles();

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
            <DrawerHeader handleDrawerClose={props.handleDrawerClose} />

            <Divider />

            <DrawerList numRecipes={props.numRecipes} />

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

/**
 * List of all Navlinks of the Drawer
 * 
 * @param {*} props 
 * @returns drawerlist
 */
function DrawerList(props: DrawerListProps) {

    /**
     * funtion to verify if an item should be highlighted and be selected
     * 
     * @param {*} hashName 
     * @returns true iff the hashname is found
     */
    const selectedItem = (hashName: string) => {
        return window.location.hash === hashName;
    }

    return (
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
    )
}

/**
 * Component representing the header of the side drawer element
 * 
 * @param {*} props 
 * @returns header of the drawer
 */
function DrawerHeader(props: DrawerHeaderProps) {

    return (
        <StyledDrawerHeader>
            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <img src={logo} alt="Recipes Manager Logo" style={{ height: '32px', marginRight: '16px' }} />
                <Typography variant="h6" color="inherit">
                    <TextContextComponent value='appName' />
                </Typography>
            </div>
            <IconButton onClick={props.handleDrawerClose} >
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </StyledDrawerHeader>)
}

/**
 * Main Application
 * 
 * @param {*} props 
 * @returns main application
 */
function App() {

    return (
        <RecipesApp />
    );
}

export default App;
