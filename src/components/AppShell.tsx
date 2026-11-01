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
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import {
    NavLink,
    useNavigate
} from "react-router-dom";
import { TextContextComponent } from '../common/context/TextContextProvider';
import pkg from '../../package.json';
import { AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Footer } from '../common/components/Footer';
import { getRecipeCount } from '../api/recipes';
import { RecipeCountContext } from '../context/RecipeCountContext';

const drawerWidth = 240;

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

interface AppShellProps {
    children: React.ReactNode;
}

function DrawerHeader(props: { handleDrawerClose: () => void }) {
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
        </StyledDrawerHeader>
    );
}

function DrawerList(props: { numRecipes: number }) {
    const selectedItem = (hashName: string) => {
        return window.location.hash === hashName;
    };

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
            <ListItemButton disabled key="Account" selected={selectedItem('#/account')}>
                <ListItemIcon><AccountCircle style={{ color: '#505050' }} /></ListItemIcon>
                <ListItemText primary="Account" />
            </ListItemButton>
            <p />
            <Divider variant='middle' />
            <div style={{ textAlign: 'center' }} >
                {pkg.version}
            </div>
        </List>
    );
}

function AppHeader(props: { open: boolean; onDrawerOpen: () => void }) {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate({
            pathname: '/recipes',
            search: searchTerm !== '' ? '?search=' + searchTerm : ''
        });
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="RecipesRouterMenu">
            <ThemeProvider theme={theme}>
                <StyledAppBar open={props.open} style={{ backgroundColor: "#2196f3" }} position="fixed">
                    <Toolbar>
                        {props.open ? '' : <IconButton
                            color="inherit"
                            aria-label="Menu"
                            onClick={props.onDrawerOpen}>
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

function AppDrawer(props: { open: boolean; numRecipes: number; onClose: () => void }) {
    return (
        <MuiDrawer
            variant="persistent"
            anchor="left"
            open={props.open}
            onClose={props.onClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <DrawerHeader handleDrawerClose={props.onClose} />
            <Divider />
            <DrawerList numRecipes={props.numRecipes} />
        </MuiDrawer>
    );
}

export function AppShell({ children }: AppShellProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [numRecipes, setNumRecipes] = useState(0);

    const fetchRecipeCount = useCallback(async () => {
        try {
            const count = await getRecipeCount();
            setNumRecipes(count);
        } catch (error) {
            console.error('Failed to fetch recipe count:', error);
            setNumRecipes(0);
        }
    }, []);

    // Fetch recipe count only once on mount
    useEffect(() => {
        fetchRecipeCount();
    }, [fetchRecipeCount]);

    const handleDrawerOpen = useCallback(() => {
        setMenuOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setMenuOpen(false);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <RecipeCountContext.Provider value={{ count: numRecipes, refresh: fetchRecipeCount }}>
                <AppDrawer open={menuOpen} numRecipes={numRecipes} onClose={handleDrawerClose} />
                <AppHeader open={menuOpen} onDrawerOpen={handleDrawerOpen} />
                <Container maxWidth="xl">
                    <Main open={menuOpen}>
                        {children}
                    </Main>
                    <Footer />
                </Container>
            </RecipeCountContext.Provider>
        </ThemeProvider>
    );
}
