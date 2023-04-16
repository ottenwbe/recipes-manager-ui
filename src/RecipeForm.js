import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { Component } from 'react';
import { PageHeader } from './PageHeader';


function newIngredient() {
    return {
        name: "",
        amount: 1,
        unit: "",
        id: new Date().getTime()
    }
}

function newRecipe() {
    return {
        name: 'My Recipe',
        servings: 1,
        description: '',
        components: [newIngredient()]
    }
}

function makeEditableRecipe(recipe) {
    let editableRecipe = JSON.parse(JSON.stringify(recipe))
    editableRecipe.components = recipe.components.map((ingredient, index) => {
        return {
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            id: index.toString() + new Date().getTime().toString()
        }
    });
    return editableRecipe;
}

const IngredientsEdit = (props) => {

    const handleAddIngredient = () => {
        props.ingredients.push(newIngredient())
        props.onIngredientsChange(props.ingredients)
    }

    const handleRemoveIngredient = (index) => {
        props.ingredients.splice(index, 1)
        props.onIngredientsChange(props.ingredients)
    }

    const handleChangeIngredient = (index, ingredient) => {
        props.ingredients[index] = ingredient
        props.onIngredientsChange(props.ingredients)
    }

    let rows = props.ingredients.map((ingredient, index) => {
        return <IngredientsRowEdit
            key={ingredient.id}
            index={index}
            disabled={props.disabled}
            ingredient={ingredient}
            onRemoveRow={handleRemoveIngredient}
            onRowChange={handleChangeIngredient} />
    });

    return (
        <div>
            <TableContainer>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <td>
                            Ingredients
                        </td>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
            </TableContainer>
            <p />
            <Button
                disabled={props.disabled}
                fullWidth
                variant="outlined"
                value="Add"
                color="primary"
                onClick={handleAddIngredient}>
                Add Ingredient
            </Button>
        </div>
    );
}

const IngredientsRowEdit = (props) => {

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value

        props.ingredient[name] = value

        props.onRowChange(props.index, props.ingredient)
    }

    const handleRemove = () => {
        props.onRemoveRow(props.index)
    }

    return (
        <TableRow>
            <td>
                <TextField
                    disabled={props.disabled}
                    name="amount"
                    id={"standard-amount" + props.index}
                    label="Amount"
                    type="number" 
                    step="0.01"
                    fullWidth
                    defaultValue={props.ingredient.amount}
                    onChange={handleChange}
                    variant="standard"
                />
            </td>
            <td>
                <TextField
                    disabled={props.disabled}                
                    name="unit"
                    id={"standard-unit" + props.index}
                    label="Unit"
                    fullWidth
                    defaultValue={props.ingredient.unit}
                    onChange={handleChange}
                    variant="standard"
                />
            </td>
            <td>
                <TextField
                    disabled={props.disabled}                
                    name="name"
                    id={"standard-name" + props.index}
                    label="Ingredient"
                    fullWidth
                    defaultValue={props.ingredient.name}
                    onChange={handleChange}
                    variant="standard"
                />
            </td>
            <td>
                <IconButton disabled={props.disabled} aria-label="delete" onClick={handleRemove}>
                    <DeleteIcon />
                </IconButton>
            </td>
        </TableRow>
    );
}

export function RecipeEdit(props) {

    const [editableRecipe] = React.useState(makeEditableRecipe(props.recipe))

    const handleIngredientsChange = (ingredients) => {
        editableRecipe.components = ingredients
        props.onChange(editableRecipe)
    }

    const handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'number' ? parseInt(target.value, 10) : target.value;
        const name = target.name;

        editableRecipe[name] = value

        props.onChange(editableRecipe)

        event.preventDefault()
    }

    return (
        <Box>
            <Box width="50%">
                <TextField
                    disabled={props.disabled}
                    name="name"
                    required id="standard-required"
                    label="Title"
                    fullWidth
                    defaultValue={editableRecipe.name}
                    onChange={handleChange}
                    variant="standard"
                />
            </Box>
            <Box width="50%">
                <TextField
                    disabled={props.disabled}
                    name="servings"
                    id="standard-number"
                    type="number"
                    label="Servings"
                    fullWidth
                    defaultValue={editableRecipe.servings}
                    onChange={handleChange}
                    variant="standard"
                />
            </Box>
            <p />
            <IngredientsEdit
                disabled={props.disabled} 
                ingredients={editableRecipe.components}
                onIngredientsChange={handleIngredientsChange}
            />
            <p />
            <div>
                <TextField
                    disabled={props.disabled}                
                    name="description"
                    id="standard-multiline"
                    label="Description"
                    multiline
                    fullWidth
                    rows={10}
                    defaultValue={editableRecipe.description}
                    variant="outlined"
                    onChange={handleChange}
                />
            </div>
        </Box>);
}

export class RecipeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recipe: newRecipe(),
            openDialog: false,
            submitting: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmitStart = () => {
        this.setState({
            openDialog: true,
            submitting: true,
            submitSuccess: true
        });
    };

    handleDialogClose = () => {
        if (this.props.submitSuccess) {
            this.props.history.push({
                pathname: '/recipes',
                search: ''
            });
        }
        this.setState({
            openDialog: false,
            submitSuccess: true
        });
    };


    handleChange = (recipe) => {
        this.setState({
            recipe: recipe
        });
    }

    handleSubmit = (event) => {
        this.handleSubmitStart();
        fetch('/api/v1/recipes', {
            method: 'post',
            body: JSON.stringify(this.state.recipe)
        })
        .then(response => response.ok ? this.setState({submitSuccess: true}) : this.setState({submitSuccess: false}))
        .then(() => this.props.onRecipesChange())
        .finally(() => this.setState({submitting: false}));        
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <PageHeader pageName="Add Recipe" />

                <RecipeUpdateDialog open={this.state.openDialog} submitSuccess={this.state.submitSuccess} submitting={this.state.submitting} onClose={this.handleDialogClose} />

                <form onSubmit={this.handleSubmit}>
                    <h1>Compose your Recipe</h1>
                    <br />
                    <RecipeEdit recipe={this.state.recipe} onChange={this.handleChange} />
                    <p />
                    <Button fullWidth variant="outlined" type="submit" value="Submit" color="primary">
                        Submit
                    </Button>
                    <p />
                </form>
            </div>
        );
    }
}

export function RecipeUpdateDialog(props) {

    let renderDialogText = () => {
        if (props.submitting) {
            return("Wait until the new Recipe has been submitted!");
        } else if (!props.submitting && props.submitSuccess) {
            return("Recipe has been added successfully!");
        }
        return("Error during submission! Title of recipe might be in use!");        
    }   

    return (
        <div>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={props.open}
                aria-labelledby="upload-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="upload-dialog-title">{"Adding New Recipe"}</DialogTitle>
                <DialogContent>
                    {props.submitting && <CircularProgress />}
                    <DialogContentText id="upload-dialog-description">
                        {renderDialogText()}                        
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary" disabled={!props.submitSuccess}>
                        Ok
                    </Button>
                    <Button onClick={props.onClose} color="primary" disabled={props.submitting}>
                        Cancel
                    </Button>                    
                </DialogActions>
            </Dialog>
        </div>
    );
}