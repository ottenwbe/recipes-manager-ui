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
import React, { Component } from 'react';
import { PageHeader } from "./PageHeader";
import { RecipeAlert } from './RecipeAlerts.js';
import { RecipeDialog } from './RecipeDialog.js';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

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
        console.log(isDifferent)
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
    const requestedRecipes = React.useRef(new RequestedRecipes(null, null, undefined));

    const [recipes, setRecipes] = React.useState(null);

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
        let result = null;
        if (recipes != null) {
            result = (
                <div>
                    {recipes.map((recipeID) => <Recipe onRefresh={refreshRecipes} onDeleteRecipe={handleDeleteRecipe} key={recipeID} recipe={recipeID} />)}
                </div>
            );
        } else if (loading.current) {
            result = (
                <div>
                    <Backdrop open={true}>
                        <CircularProgress size={50} />
                        "Loading Recipes"
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
        <div>
            <PageHeader pageName="Recipes" />
            <p />
            <RecipeChips data={searchParams} loading={loading.current} handleChipDelete={handleDataDelete} />
            <p />
            {renderRecipes()}
        </div>);
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

class Recipe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            picture: null,
            recipe: null,
            open: false,
            modal: false,
            lastError: '',
            openEditDialog: false,
            recipeRevision: 0,
            name: Math.random()
        };

        this.anchorRef = React.createRef()

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMoreClick = this.handleMoreClick.bind(this);
    }

    handleOpen = () => {
        window.location.href = '/#/recipes/' + this.state.recipe.id;
        window.location.reload();
    }

    handleDelete = () => {
        fetch('/api/v1/recipes/r/' + this.state.recipe.id, {
            method: 'delete'
        })
            .then(response => {
                if (!response.ok) {
                    this.setState({ lastError: "Could not delete recipe. Try again later..." });
                }
                this.props.onDeleteRecipe(this.state.recipe.id)
            })
            .catch(
                err => { console.error(err); this.setState({ lastError: "Could not delete recipe!" }); }
            );
    }

    componentDidMount() {
        this.refreshRecipe()
    }

    refreshRecipe = (amount, updateVersion) => {
        let url = '/api/v1/recipes/r/' + this.props.recipe;
        if (amount !== undefined) {
            url += '?servings=' + amount
        }
        let recipeRevision = this.state.recipeRevision
        if (updateVersion) {
            recipeRevision += 1
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {this.setState({ recipe: data, name: data.name, recipeRevision: recipeRevision }); return data;})
            .then((recipe) => {
                if ((recipe != null
                    && recipe.pictureLink != null)
                    && (recipe.pictureLink.length > 0)
                    && (recipe.pictureLink[0] !== '')) {
                    fetch('/api/v1/recipes/r/' + recipe.id
                        + '/pictures/' + recipe.pictureLink[0] + '/')
                        .then(response => response.json())
                        .then(data => this.setState({ picture: data }));
                }
            }).catch((err) => { console.log(err); this.setState({ lastError: 'Failed to load recipe: ' + this.props.recipe }) });
    }

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    handleChange(event) {
        this.setState({ portions: event.target.value });
        event.preventDefault();
    }

    handleSubmit(event) {
        this.refreshRecipe(event.target.value);
        event.preventDefault();
    }

    handleMoreClick(event) {
        this.handleToggle()
        event.preventDefault();
    }

    handleEdit = () => {
        this.setState({ openEditDialog: true, modal: false })
    }

    onCloseDialog = () => {
        this.setState({ openEditDialog: false })
        this.refreshRecipe()
    }

    onChangeRecipe = () => {
        this.refreshRecipe()
    }

    handleToggle = () => {
        this.setState({ open: !this.state.open });
    }

    handleClose = (event) => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }

        this.setState({ open: false, modal: false });
    }

    handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            this.setState({ open: false });
        }
    }

    handleOnCloseError = () => {
        this.setState({
            lastError: ''
        })
    }

    handleReset = () => {
        this.refreshRecipe(undefined, true)
    }

    handleSimilar = () => {
        window.location.href = '/#/recipes?similarTo=' + this.state.recipe.id;
        this.setState({ open: false });
        window.location.reload();
    }

    keyName = (prefix) => {
        return prefix + this.state.name + this.state.recipeRevision
    }

    render() {
        return (
            <div key={this.keyName("recipe")}>
                <RecipeDialog key={this.keyName("recipeDialog")} recipe={this.state.recipe} open={this.state.openEditDialog} onClose={this.onCloseDialog} />
                <Card key={this.keyName("card")}>
                    <CardHeader key={this.keyName("cardheader")} title={this.state.recipe != null ? this.state.recipe.name : ""} subheader="Recipe" style={{ backgroundColor: "#2196f3" }}
                        action={<div>
                            <IconButton onClick={this.handleOpen} aria-expanded={this.state.expanded} aria-label="Show more">
                                <LaunchIcon />
                            </IconButton>
                            <IconButton onClick={this.handleExpandClick} aria-expanded={this.state.expanded} aria-label="Show more">
                                <ExpandMoreIcon />
                            </IconButton>
                            <IconButton ref={this.anchorRef} onClick={this.handleMoreClick} aria-label="Menu">
                                <MoreVertIcon />
                            </IconButton>
                        </div>} />
                    <RecipeAlert
                        key={this.keyName("recipeAlert")}
                        enabled={this.state.lastError !== ""}
                        message={this.state.lastError}
                        onClose={this.handleOnCloseError}
                    />
                    <Collapse key={this.keyName("collapse")} in={this.state.expanded} timeout="auto" unmountOnExit>
                        {this.renderCardMedia()}
                        <CardContent key={this.keyName("cardcontent")}>
                            <Typography component="div" align='right'>
                                <IconButton onClick={this.handleReset} color="primary">
                                    <UpdateIcon label="Update" />
                                </IconButton>
                                <TextField
                                    name="servings"
                                    type="number"
                                    label="Servings"
                                    defaultValue={this.state.recipe !== null ? this.state.recipe.servings : 0}
                                    onChange={this.handleSubmit}
                                />
                                <p />
                            </Typography>
                            {this.renderIngredients()}
                            <RecipeDescription recipe={this.state.recipe} />
                        </CardContent>
                    </Collapse>
                    <RecipeMenu open={this.state.open} onListKeyDown={this.handleListKeyDown} menuRef={this.anchorRef} onEdit={this.handleEdit} onDelete={this.handleDelete} onClose={this.handleClose} onFindSimilar={this.handleSimilar} onOpen={this.handleOpen} />
                </Card></div>);
    }
    renderIngredients() {
        if (this.state.recipe != null) {
            return (<Ingredients key={this.keyName("ingredients")} ingredients={this.state.recipe.components} />);
        }
        else {
            return '';
        }
    }
    renderCardMedia() {
        if ((this.state.picture != null) && (this.state.picture !== '')) {
            return (<CardMedia key={this.keyName("pictures")} className="media" image={this.state.picture.picture} style={{ height: 0, paddingTop: '56.25%' }} title="dish" />);
        }
        else
            return '';
    }
}

export class RandomRecipe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recipe: null,
        };
    }

    componentDidMount() {
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
            .then(response => this.setState({ recipe: response }))
            .catch(err => this.setState({ recipe: null }));
    }

    render() {
        return (
            <div>
                <PageHeader pageName="Random Recipe" />
                {this.state.recipe != null ? <Recipe key={1} recipe={this.state.recipe.id} /> : "No Recipe Found"}
            </div>
        );
    }
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

export class Ingredients extends Component {

    render() {
        if (this.props.ingredients != null) {
            let rows = this.props.ingredients.map((ingredient, index) => {
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
