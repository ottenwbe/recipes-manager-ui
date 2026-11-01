import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
//import { makeStyles } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpdateIcon from '@mui/icons-material/Update';
import React, { Fragment, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PageHeader } from "../../common/components/PageHeader";
import { RecipeAlert } from './RecipeAlerts';
import { RecipeDialog } from './RecipeDialog';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { TextContext } from '../../common/context/TextContext';
import { textFromContext } from '../../common/context/TextContextProvider';
import type { Ingredient, Recipe, RecipeId, RecipePicture } from '../../common/types';
import { getAllRecipes, searchRecipes, getSimilarRecipes, getRecipeById, deleteRecipe, getRandomRecipe, getRecipePicture } from '../../api/recipes';
import { useRecipeCount } from '../../context/RecipeCountContext';

/*const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));*/

class RequestedRecipes {
    search: string | null;
    similarTo: string | null;
    recipeID: string | null | undefined;

    constructor(search: string | null, similarTo: string | null, recipeID: string | null | undefined) {
        this.search = search;
        this.similarTo = similarTo;
        this.recipeID = recipeID;
    }

    refreshAndisDifferent(search: string | null, similarTo: string | null, recipeID: string | undefined): boolean {
        console.log("change stuff")
        let isDifferent = (search !== this.search) || (similarTo !== this.similarTo) || (recipeID !== this.recipeID);
        console.log('isDifferent: ' + isDifferent)
        console.log(this.search)
        console.log(search)
        this.search = search;
        console.log(this.similarTo)
        console.log(similarTo)
        this.similarTo = similarTo;
        console.log(this.recipeID)
        console.log(recipeID)
        this.recipeID = recipeID;
        return isDifferent
    }

}

interface RecipesProps {
    onRecipesChange?: () => void; // deprecated — use useRecipeCount().refresh instead
}

interface RecipeChipsProps {
    data: URLSearchParams;
    loading: boolean;
    handleChipDelete?: (key: string) => void;
}

interface RecipeMenuProps {
    open: boolean;
    menuRef: React.RefObject<HTMLButtonElement | null>;
    onClose: (event: MouseEvent | TouchEvent) => void;
    onDelete: () => void;
    onEdit: () => void;
    onFindSimilar: () => void;
    onListKeyDown: React.KeyboardEventHandler;
    onOpen: () => void;
}

interface RecipeCardProps {
    recipe: RecipeId;
    onRefresh?: () => void;
    onDeleteRecipe?: (recipeId: RecipeId) => void;
}

interface IngredientsRowProps {
    ingredient: Ingredient;
}

interface IngredientsProps {
    ingredients: Ingredient[];
}

interface RecipeDescriptionProps {
    recipe: Recipe | null;
}

interface RecipeDescriptionPartProps {
    text: string;
}

export function Recipes(props: RecipesProps) {

    const [searchParams] = useSearchParams();
    let { recipe } = useParams();
    let navigate = useNavigate();

    const loading = React.useRef(false);
    const requestedRecipes = React.useRef(new RequestedRecipes(null, null, null));

    const [recipes, setRecipes] = React.useState<RecipeId[] | null>(null);

    const texts = useContext(TextContext);
    const { refresh: refreshRecipeCount } = useRecipeCount();

    const handleDeleteRecipe = (removedID: RecipeId) => {
        // Notify both the legacy prop and the context
        props.onRecipesChange?.();
        refreshRecipeCount();

        if (recipes === null) {
            return;
        }

        const filtered = recipes.filter(value => value !== removedID);

        setRecipes(filtered);
    }

    const refreshRecipesIfChanged = (newRecipes: RecipeId[]) => {
        if (JSON.stringify(newRecipes) !== JSON.stringify(recipes)) {
            console.log('loading new recipes')
            console.log(newRecipes)
            console.log(recipes)
            setRecipes(newRecipes)
        }
    }

    const refreshRecipes = (): void => {
        if (shouldSearch()) {
            console.log('fetch search result')
            getSearchedRecipes();
        } else if (shouldGetSimilarResults()) {
            console.log('fetch similar result')
            getSimilarRecipesList()
        } else if (shouldGetAllRecipes()) {
            console.log('fetch all')
            getAllRecipesList()
        } else {
            console.log('fetch sepecific')
            if (recipe !== undefined) {
                refreshRecipesIfChanged([recipe]);
            }
        }
    }

    const shouldGetSimilarResults = (): boolean => {
        return searchParams.get('similar-to') !== null
    }

    const shouldSearch = (): boolean => {
        return searchParams.get('search') !== null
    }

    const shouldGetAllRecipes = (): boolean => {
        console.log(recipe)
        return recipe === undefined;
    }

    const getAllRecipesList = () => {
        loading.current = true;
        getAllRecipes()
            .then(recipeIds => refreshRecipesIfChanged(recipeIds as RecipeId[]))
            .catch(err => console.error('Failed to fetch recipes:', err))
            .finally(() => loading.current = false);
    }

    const getSearchedRecipes = () => {
        loading.current = true;
        const search = searchParams.get('search') ?? '';
        searchRecipes({ name: search, description: search })
            .then(recipeIds => refreshRecipesIfChanged(recipeIds as RecipeId[]))
            .catch(err => console.error('Failed to search recipes:', err))
            .finally(() => loading.current = false);
    }

    const getSimilarRecipesList = () => {
        loading.current = true;
        const similarTo = searchParams.get('similar-to') ?? '';
        getSimilarRecipes(similarTo)
            .then(recipeIds => refreshRecipesIfChanged(recipeIds as RecipeId[]))
            .catch(err => console.error('Failed to fetch similar recipes:', err))
            .finally(() => loading.current = false);
    }

    React.useEffect(() => {
        console.log('useEffect called');
        if (requestedRecipes.current.refreshAndisDifferent(searchParams.get('search'), searchParams.get('similar-to'), recipe)) {
            console.log('useEffect Changed');
            refreshRecipes();
        }
    })

    // on url change or navbar clicks update the internal state
    /*const componentDidUpdate = (prevProps, prevState) => {
        const queryString = require('query-string');
        let parsedData = queryString.parse(this.props.location.search);

        console.log("update")
        console.log(parsedData)

        if (this.state.data !== undefined
            && JSON.stringify(parsedData) !== JSON.stringify(prevState.data)) {
            this.setState({ data: parsedData })
            this.refreshRecipes()
        }
    }*/

    const handleDataDelete = (delData: string) => {
        
        searchParams.delete(delData)

        console.log(searchParams);
        let url = createPath(searchParams);

        console.log.apply(url)

        navigate({
            pathname: '/recipes',
            search: url
        });

        //let history = useNavigate()
        //window.location.href = url;
        //window.location.reload();
        //this.setState({ data: tmpData });
        //this.refreshRecipes();
    }

    const renderRecipes = (): React.ReactNode => {
        let result: React.ReactNode;
        if (recipes != null) {
            result = (
                <Fragment>
                    {recipes.map((recipeID) => <Recipe onRefresh={refreshRecipes} onDeleteRecipe={handleDeleteRecipe} key={recipeID} recipe={recipeID} />)}
                </Fragment>
            );
        } else if (loading.current) {
            result = (
                <div>
                    <Backdrop open={true}>
                        <CircularProgress size={50} />
                        Loading Recipes
                    </Backdrop>
                </div>
            );
        } else {
            result = (<div style={{ textAlign: 'center' }}>No Recipes Found</div>);
        }
        return result;
    }

    const createPath = (data: URLSearchParams): string => {
        const query = data.toString();
        return query === '' ? '' : `?${query}`;
    }

    return (
        <React.Fragment>
            <PageHeader pageName={textFromContext(texts, 'recipesPageHeading')} />
            <p />
            <RecipeChips data={searchParams} loading={loading.current} handleChipDelete={handleDataDelete} />
            <p />
            {renderRecipes()}
        </React.Fragment>);
}

//

function RecipeChips(props: RecipeChipsProps) {

    //const classes = useStyles();

    const chips: React.ReactElement[] = [];

    props.data.forEach( (value, key) => {
        console.log('chip')
        console.log(value)
        console.log(key)
        if (value !== undefined) {
            chips.push(<Chip
                color="secondary"
                key={key}
                label={key + '=' + value}
                onDelete={props.handleChipDelete !== undefined ? () => props.handleChipDelete?.(key) : undefined}
            /*className={classes.chip}*/
            />);
        }
    })

    return (
        <Paper>            
            {props.loading ? "" : chips}
        </Paper>
    );
}

function RecipeMenu(props: RecipeMenuProps) {
    return (
        <Popper open={props.open} anchorEl={props.menuRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={props.onClose}>
                            <MenuList autoFocusItem={props.open} id="menu-list-grow" onKeyDown={props.onListKeyDown}>
                                <MenuItem onClick={props.onOpen}>Open</MenuItem>
                                <MenuItem onClick={props.onEdit}>Edit</MenuItem>
                                <MenuItem onClick={props.onDelete}>Delete</MenuItem>
                                <MenuItem onClick={props.onFindSimilar}>Find Similar Recipes</MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
}

function Recipe(props: RecipeCardProps) {
    const [expanded, setExpanded] = useState(true);
    const [picture, setPicture] = useState<RecipePicture | string | null>(null);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [open, setOpen] = useState(false);
    const [lastError, setLastError] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [recipeRevision, setRecipeRevision] = useState(0);
    const [name, setName] = useState<string | number>(Math.random());

    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const navigate = useNavigate();

    const handleOpen = () => {
        if (recipe?.id !== undefined) {
            navigate('/recipes/' + recipe.id);
        }
    }

    const handleDelete = () => {
        if (recipe?.id === undefined) {
            return;
        }

        const recipeId = String(recipe.id);
        deleteRecipe(recipeId)
            .then(() => props.onDeleteRecipe?.(recipeId))
            .catch(err => {
                console.error(err);
                setLastError("Could not delete recipe. Try again later...");
            });
    }

    const refreshRecipe = useCallback((amount?: string, updateVersion = false) => {
        const servings = amount !== undefined ? parseInt(amount, 10) : undefined;
        let currentRevision = recipeRevision;
        if (updateVersion) {
            currentRevision += 1
            setRecipeRevision(currentRevision)
        }

        getRecipeById(String(props.recipe), servings)
            .then(data => { setRecipe(data); setName(data.name); return data; })
            .then((recipe) => {
                if ((recipe != null
                    && recipe.pictureLink != null)
                    && (recipe.pictureLink.length > 0)
                    && (recipe.pictureLink[0] !== '')) {
                    getRecipePicture(String(recipe.id), recipe.pictureLink[0])
                        .then(data => setPicture({ picture: data.picture } as RecipePicture))
                        .catch(err => console.error('Failed to load picture:', err));
                }
            }).catch((err) => { console.log(err); setLastError('Failed to load recipe: ' + props.recipe) });
    }, [props.recipe, recipeRevision]);

    useEffect(() => {
        refreshRecipe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount similar to componentDidMount

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        refreshRecipe(event.target.value);
        event.preventDefault();
    }

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        handleToggle()
        event.preventDefault();
    }

    const handleEdit = () => {
        setOpenEditDialog(true);
    }

    const onCloseDialog = () => {
        setOpenEditDialog(false);
        refreshRecipe();
    }

    const handleToggle = () => {
        setOpen(!open);
    }

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && event.target instanceof Node && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    }

    const handleListKeyDown: React.KeyboardEventHandler = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handleOnCloseError = () => {
        setLastError('');
    }

    const handleReset = () => {
        refreshRecipe(undefined, true)
    }

    const handleSimilar = () => {
        if (recipe?.id !== undefined) {
            navigate('/recipes?similarTo=' + recipe.id);
            setOpen(false);
        }
    }

    const keyName = (prefix: string): string => {
        return prefix + name + recipeRevision
    }

    const renderIngredients = (): React.ReactNode => {
        if (recipe != null) {
            return (<Ingredients key={keyName("ingredients")} ingredients={recipe.components} />);
        }
        else {
            return '';
        }
    }
    const renderCardMedia = (): React.ReactNode => {
        if (typeof picture === 'object' && picture !== null) {
            return (<CardMedia key={keyName("pictures")} className="media" image={picture.picture} style={{ height: 0, paddingTop: '56.25%' }} title="dish" />);
        }
        else
            return '';
    }

    return (
        <div key={keyName("recipe")}>
            {recipe !== null && <RecipeDialog key={keyName("recipeDialog")} recipe={recipe} open={openEditDialog} onClose={onCloseDialog} />}
            <Card key={keyName("card")}>
                <CardHeader key={keyName("cardheader")} title={recipe != null ? recipe.name : ""} subheader="Recipe" style={{ backgroundColor: "#2196f3" }}
                    action={<div>
                        <IconButton onClick={handleOpen} aria-expanded={expanded} aria-label="Show more">
                            <LaunchIcon />
                        </IconButton>
                        <IconButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="Show more">
                            <ExpandMoreIcon />
                        </IconButton>
                        <IconButton ref={anchorRef} onClick={handleMoreClick} aria-label="Menu">
                            <MoreVertIcon />
                        </IconButton>
                    </div>} />
                <RecipeAlert
                    key={keyName("recipeAlert")}
                    enabled={lastError !== ""}
                    message={lastError}
                    onClose={handleOnCloseError}
                />
                <Collapse key={keyName("collapse")} in={expanded} timeout="auto" unmountOnExit>
                    {renderCardMedia()}
                    <CardContent key={keyName("cardcontent")}>
                        <Typography component="div" align='right'>
                            <IconButton onClick={handleReset} color="primary">
                                <UpdateIcon />
                            </IconButton>
                            <TextField
                                name="servings"
                                type="number"
                                label="Servings"
                                defaultValue={recipe !== null ? recipe.servings : 0}
                                onChange={handleSubmit}
                            />
                            <p />
                        </Typography>
                        {renderIngredients()}
                        <RecipeDescription recipe={recipe} />
                    </CardContent>
                </Collapse>
                <RecipeMenu open={open} onListKeyDown={handleListKeyDown} menuRef={anchorRef} onEdit={handleEdit} onDelete={handleDelete} onClose={handleClose} onFindSimilar={handleSimilar} onOpen={handleOpen} />
            </Card></div>);
}

export function RandomRecipe() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        getRandomRecipe()
            .then(setRecipe)
            .catch(() => setRecipe(null));
    }, []);

    return (
        <div>
            <PageHeader pageName="Random Recipe" />
            {recipe?.id !== undefined ? <Recipe key={recipe.id} recipe={recipe.id} /> : "No Recipe Found"}
        </div>
    );
}

const IngredientsRow = (props: IngredientsRowProps) => {
    return (
        <TableRow>
            <TableCell>
                {props.ingredient.amount !== -1 ? props.ingredient.amount : ""}
            </TableCell>
            <TableCell>
                {props.ingredient.unit}
            </TableCell>
            <TableCell>
                {props.ingredient.name}
            </TableCell>
        </TableRow>
    );
};

export function Ingredients({ ingredients }: IngredientsProps) {
    if (ingredients != null) {
        let rows = ingredients.map((ingredient, index) => {
            return <IngredientsRow key={index} ingredient={ingredient} />
        });
        return (
            <TableContainer >
                <Table className="recipes-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Amount</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Ingredients</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>);
    } else {
        return ""
    }
}

function RecipeDescription(props: RecipeDescriptionProps): React.ReactNode {
    if (props.recipe === null) {
        return null;
    }
    return props.recipe.description.split('\n').map((textPart, index) => <RecipeDescriptionPart key={index} text={textPart} />);
}

function RecipeDescriptionPart(props: RecipeDescriptionPartProps) {
    return (<div><p> {props.text} </p><p /></div>);
}
