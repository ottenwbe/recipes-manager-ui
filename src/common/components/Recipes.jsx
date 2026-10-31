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
import { PageHeader } from "./PageHeader";
import { RecipeAlert } from './RecipeAlerts';
import { RecipeDialog } from './RecipeDialog';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { TextContext } from '../context/TextContext';
import { textFromContext } from '../context/TextContextProvider';

/*const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));*/

class RequestedRecipes {
    constructor(search, similarTo, recipeID) {
        this.search = search;
        this.similarTo = similarTo;
        this.recipeID = recipeID;
    }

    refreshAndisDifferent(search, similarTo, recipeID) {
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

export function Recipes(props) {

    const [searchParams] = useSearchParams();
    let { recipe } = useParams();
    let navigate = useNavigate();

    const loading = React.useRef(false);
    const requestedRecipes = React.useRef(new RequestedRecipes([undefined], [undefined], [undefined]));

    const [recipes, setRecipes] = React.useState(null);

    const texts = useContext(TextContext);

    const handleDeleteRecipe = (removedID) => {
        if (props.onRecipesChange !== undefined) {
            props.onRecipesChange();
        }

        let filtered = recipes.filter(function (value, index, arr) {
            return value !== removedID;
        });

        setRecipes(filtered);
    }

    const refreshRecipesIfChanged = (newRecipes) => {
        if (JSON.stringify(newRecipes) !== JSON.stringify(recipes)) {
            console.log('loading new recipes')
            console.log(newRecipes)
            console.log(recipes)
            setRecipes(newRecipes)
        }
    }

    const refreshRecipes = () => {
        if (shouldSearch()) {
            console.log('fetch search result')
            getSearchedRecipes();
        } else if (shouldGetSimilarResults()) {
            console.log('fetch similar result')
            getSimilarRecipes()
        } else if (shouldGetAllRecipes()) {
            console.log('fetch all')
            getAllRecipes()
        } else {
            console.log('fetch sepecific')
            refreshRecipesIfChanged([recipe]);
        }
    }

    const shouldGetSimilarResults = () => {
        return searchParams.get('similar-to') !== null
    }

    const shouldSearch = () => {
        return searchParams.get('search') !== null
    }

    const shouldGetAllRecipes = () => {
        console.log(recipe)
        return recipe === undefined;
    }

    const getAllRecipes = () => {
        loading.current = true;
        fetch('/api/v1/recipes')
            .then(response => response.json())
            .then(responseJSON => refreshRecipesIfChanged(responseJSON.recipes))
            .finally(() => loading.current = false);
    }

    const getSearchedRecipes = () => {
        loading.current = true;
        let search = searchParams.get('search');
        fetch('/api/v1/recipes?name=' + search + '&description=' + search)
            .then(response => response.json())
            .then(responseJSON => refreshRecipesIfChanged(responseJSON.recipes))
            .finally(() => loading.current = false);
    }

    const getSimilarRecipes = () => {
        loading.current = true;
        let similarTo = searchParams.get('similar-to');
        fetch('/api/v1/recommendation/' + similarTo + '/components')
            .then(response => response.json())
            .then(responseJSON => refreshRecipesIfChanged(responseJSON.recipes))
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

    const handleDataDelete = (delData) => {
        
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

    const renderRecipes = () => {
        let result;
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

    const createPath = (data) => {
        let path = '';
        let pathPart = '?';

        console.log('createPath')

        data.forEach( (value, paramName) => {
            if (value !== undefined) {
                path = path + pathPart + paramName + '=' + value;
                pathPart = '&';
            }
        })
        console.log(path)
        return path;
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

function RecipeChips(props) {

    //const classes = useStyles();

    let chips = [];

    props.data.forEach( (value, key) => {
        console.log('chip')
        console.log(value)
        console.log(key)
        if (value !== undefined) {
            chips.push(<Chip
                color="secondary"
                key={key}
                label={key + '=' + value}
                onDelete={props.handleChipDelete !== undefined ? () => {props.handleChipDelete(key)} : undefined}
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

function RecipeMenu(props) {
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

function Recipe(props) {
    const [expanded, setExpanded] = useState(true);
    const [picture, setPicture] = useState(null);
    const [recipe, setRecipe] = useState(null);
    const [open, setOpen] = useState(false);
    const [lastError, setLastError] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [recipeRevision, setRecipeRevision] = useState(0);
    const [name, setName] = useState(Math.random());

    const anchorRef = useRef(null);
    const navigate = useNavigate();

    const handleOpen = () => {
        navigate('/recipes/' + recipe.id);
    }

    const handleDelete = () => {
        fetch('/api/v1/recipes/r/' + recipe.id, {
            method: 'delete'
        })
            .then(response => {
                if (!response.ok) {
                    setLastError("Could not delete recipe. Try again later...");
                }
                props.onDeleteRecipe(recipe.id)
            })
            .catch(
                err => { console.error(err); setLastError("Could not delete recipe!"); }
            );
    }

    const refreshRecipe = useCallback((amount, updateVersion) => {
        let url = '/api/v1/recipes/r/' + props.recipe;
        if (amount !== undefined) {
            url += '?servings=' + amount
        }
        let currentRevision = recipeRevision;
        if (updateVersion) {
            currentRevision += 1
            setRecipeRevision(currentRevision)
        }

        fetch(url)
            .then(response => response.json())
            .then(data => { setRecipe(data); setName(data.name); return data; })
            .then((recipe) => {
                if ((recipe != null
                    && recipe.pictureLink != null)
                    && (recipe.pictureLink.length > 0)
                    && (recipe.pictureLink[0] !== '')) {
                    fetch('/api/v1/recipes/r/' + recipe.id
                        + '/pictures/' + recipe.pictureLink[0] + '/')
                        .then(response => response.json())
                        .then(data => setPicture(data));
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

    const handleSubmit = (event) => {
        refreshRecipe(event.target.value);
        event.preventDefault();
    }

    const handleMoreClick = (event) => {
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

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    }

    const handleListKeyDown = (event) => {
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
        navigate('/recipes?similarTo=' + recipe.id);
        setOpen(false);
    }

    const keyName = (prefix) => {
        return prefix + name + recipeRevision
    }

    const renderIngredients = () => {
        if (recipe != null) {
            return (<Ingredients key={keyName("ingredients")} ingredients={recipe.components} />);
        }
        else {
            return '';
        }
    }
    const renderCardMedia = () => {
        if ((picture != null) && (picture !== '')) {
            return (<CardMedia key={keyName("pictures")} className="media" image={picture.picture} style={{ height: 0, paddingTop: '56.25%' }} title="dish" />);
        }
        else
            return '';
    }

    return (
        <div key={keyName("recipe")}>
            <RecipeDialog key={keyName("recipeDialog")} recipe={recipe} open={openEditDialog} onClose={onCloseDialog} />
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
                                <UpdateIcon label="Update" />
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

export function RandomRecipe(props) {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetch('/api/v1/recipes/rand')
            .then(
                function (response) {
                    if (!response.ok) {
                        throw new Error("Not 2xx response")
                    } else {
                        return response.json()
                    }
                }
            )
            .then(response => setRecipe(response))
            .catch(err => setRecipe(null));
    }, []);

    return (
        <div>
            <PageHeader pageName="Random Recipe" />
            {recipe != null ? <Recipe key={1} recipe={recipe.id} /> : "No Recipe Found"}
        </div>
    );
}

const IngredientsRow = (props) => {
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

export function Ingredients({ ingredients }) {
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

function RecipeDescription(props) {
    let recipeParts = '';
    if (props.recipe != null) {
        recipeParts = props.recipe.description.split('\n').map((textPart, index) => <RecipeDescriptionPart key={index} text={textPart} />);
    }
    return recipeParts;
}

function RecipeDescriptionPart(props) {
    return (<div><p> {props.text} </p><p /></div>);
}
