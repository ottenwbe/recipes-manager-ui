import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LaunchIcon from '@material-ui/icons/Launch';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UpdateIcon from '@material-ui/icons/Update';
import React, { Component } from 'react';
import { PageHeader } from "./PageHeader";
import { RecipeAlert } from './RecipeAlerts.js';
import { RecipeDialog } from './RecipeDialog.js';

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));

export class Recipes extends Component {
    constructor(props) {
        super(props);

        const queryString = require('query-string');
        let parsedData = queryString.parse(this.props.location.search);

        this.state = {
            recipes: null, //e.g., ["1"]
            loading: false,
            data: parsedData //all url based filters: ?search=''&similarTo=''
        };
    }

    handleDeleteRecipe = (removedID) => {
        if (this.props.onRecipesChange !== undefined) {
            this.props.onRecipesChange();
        }

        let filtered = this.state.recipes.filter(function (value, index, arr) {
            return value !== removedID;
        });

        this.setState({ recipes: filtered });
    }

    refreshRecipes = () => {
        if (this.shouldSearch()) {
            this.getSearchedRecipes();
        } else if (this.shouldGetSimilarResults()) {
            this.getSimilarRecipes()
        } else if (this.shouldGetAllRecipes()) {
            this.getAllRecipes()
        } else {
            this.setState({ recipes: [this.props.match.params.recipe] });
        }
    }

    shouldGetSimilarResults = () => {
        return this.state.data.similarTo !== undefined
    }

    shouldSearch = () => {
        return this.state.data.search !== undefined;
    }

    shouldGetAllRecipes = () => {
        return this.props.match.params.recipe === undefined;
    }

    getAllRecipes = () => {
        this.setState({ loading: true });
        fetch('/api/v1/recipes')
            .then(response => response.json())
            .then(responseJSON => this.setState({ recipes: responseJSON.recipes }))
            .finally(() => this.setState({ loading: false }));
    }

    getSearchedRecipes = () => {
        this.setState({ loading: true });
        let search = this.state.data.search
        fetch('/api/v1/recipes?name=' + search + '&description=' + search)
            .then(response => response.json())
            .then(responseJSON => this.setState({ recipes: responseJSON.recipes }))
            .finally(() => this.setState({ loading: false }));
    }

    getSimilarRecipes = () => {
        this.setState({ loading: true });
        fetch('/api/v1/recommendation/' + this.state.data.similarTo + '/components')
            .then(response => response.json())
            .then(responseJSON => this.setState({ recipes: responseJSON.recipes }))
            .finally(() => this.setState({ loading: false }));
    }

    componentDidMount() {
        this.refreshRecipes()
    }

    // on url change or navbar clicks update the internal state
    componentDidUpdate(prevProps, prevState) {
        const queryString = require('query-string');
        let parsedData = queryString.parse(this.props.location.search);

        console.log("update")
        console.log(parsedData)

        if (this.state.data !== undefined
            && JSON.stringify(parsedData) !== JSON.stringify(prevState.data)) {
            this.setState({ data: parsedData })
            this.refreshRecipes()
        }
    }

    handleDataDelete = (delData) => () => {
        let tmpData = this.state.data;
        tmpData[delData] = undefined;

        console.log(tmpData);
        let url = this.createURL(tmpData);

        this.props.history.push({
            pathname: '/recipes',
            search: url
        });

        //let history = useHistory()
        //window.location.href = url;
        //window.location.reload();
        //this.setState({ data: tmpData });
        //this.refreshRecipes();
    }

    renderRecipes = () => {
        let result = null;
        if (this.state.recipes != null) {
            result = (
                <div>
                    {this.state.recipes.map((recipeID) => <Recipe onRefresh={this.refreshRecipes} onDeleteRecipe={this.handleDeleteRecipe} key={recipeID} recipe={recipeID} />)}
                </div>
            );
        } else if (this.state.loading) {
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

    createURL(data) {
        let url = '';
        let urlPart = '?';

        for (const paramName in data) {
            if (data[paramName] !== undefined) {
                url = url + urlPart + paramName + '=' + data[paramName];
                urlPart = '&';
            }
        }
        return url;
    }

    render() {
        return (
            <div>
                <PageHeader pageName="Recipes" />
                <p />
                <RecipeChips data={this.state.data} loading={this.state.loading} handleChipDelete={this.handleDataDelete} />
                <p />
                {this.renderRecipes()}
            </div>);
    }
}

function RecipeChips(props) {

    const classes = useStyles();
    let chips = [];

    for (const paramName in props.data) {
        if (props.data[paramName] !== undefined) {
            chips.push(<Chip
                color="secondary"
                key={paramName}
                label={paramName + '=' + props.data[paramName]}
                onDelete={props.handleChipDelete !== undefined ? props.handleChipDelete(paramName) : undefined}
                className={classes.chip}
            />);
        }
    }

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
            .then(data => this.setState({ recipe: data, name: data.name, recipeRevision: recipeRevision }))
            .then(() => {
                if ((this.state.recipe.pictureLink != null)
                    && (this.state.recipe.pictureLink.length > 0)
                    && (this.state.recipe.pictureLink[0] !== '')) {
                    fetch('/api/v1/recipes/r/' + this.state.recipe.id
                        + '/pictures/' + this.state.recipe.pictureLink[0] + '/')
                        .then(response => response.json())
                        .then(data => this.setState({ picture: data }));
                }
            }).catch((err) => this.setState({ lastError: 'Failed to load recipe: ' + this.props.recipe }));
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
