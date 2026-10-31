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
import React, { useContext, useState } from 'react';
import { PageHeader } from '../../common/components/PageHeader';
import { TextContext } from '../../common/context/TextContext';
import { textFromContext } from '../../common/context/TextContextProvider';
import { useNavigate } from 'react-router-dom';
import type { Ingredient, Recipe } from '../../common/types';

interface IngredientsEditProps {
    disabled?: boolean;
    ingredients: Ingredient[];
    onIngredientsChange: (ingredients: Ingredient[]) => void;
}

interface IngredientsRowEditProps {
    disabled?: boolean;
    index: number;
    ingredient: Ingredient;
    onRemoveRow: (index: number) => void;
    onRowChange: (index: number, ingredient: Ingredient) => void;
}

interface RecipeEditProps {
    disabled?: boolean;
    recipe: Recipe;
    onChange: (recipe: Recipe) => void;
}

interface RecipeFormProps {
    onRecipesChange?: () => void;
}

interface RecipeUpdateDialogProps {
    open: boolean;
    submitSuccess: boolean;
    submitting: boolean;
    onClose: () => void;
}

function newIngredient(): Ingredient {
    return {
        name: "",
        amount: 1,
        unit: "",
        id: new Date().getTime()
    }
}

function newRecipe(): Recipe {
    return {
        name: 'My Recipe',
        servings: 1,
        description: '',
        components: [newIngredient()]
    }
}

function makeEditableRecipe(recipe: Recipe): Recipe {
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

const IngredientsEdit = (props: IngredientsEditProps) => {

    const handleAddIngredient = () => {
        props.ingredients.push(newIngredient())
        props.onIngredientsChange(props.ingredients)
    }

    const handleRemoveIngredient = (index: number) => {
        props.ingredients.splice(index, 1)
        props.onIngredientsChange(props.ingredients)
    }

    const handleChangeIngredient = (index: number, ingredient: Ingredient) => {
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

const IngredientsRowEdit = (props: IngredientsRowEditProps) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;

        if (name === 'amount') {
            props.ingredient.amount = parseFloat(value);
        } else if (name === 'unit') {
            props.ingredient.unit = value;
        } else if (name === 'name') {
            props.ingredient.name = value;
        }

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
                    slotProps={{ htmlInput: { step: 0.01 } }}
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

export function RecipeEdit(props: RecipeEditProps) {

    const [editableRecipe] = React.useState(makeEditableRecipe(props.recipe));
    const texts = useContext(TextContext);

    const handleIngredientsChange = (ingredients: Ingredient[]) => {
        editableRecipe.components = ingredients
        props.onChange(editableRecipe)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;

        if (name === 'name') {
            editableRecipe.name = value;
        } else if (name === 'servings') {
            editableRecipe.servings = parseInt(value, 10);
        } else if (name === 'description') {
            editableRecipe.description = value;
        }

        props.onChange({ ...editableRecipe });

        event.preventDefault()
    }

    return (
        <Box>
            <Box sx={{ width: '50%' }}>
                <TextField
                    disabled={props.disabled}
                    name="name"
                    required id="standard-required"
                    label={textFromContext(texts, "recipeFormTitle")}
                    fullWidth
                    defaultValue={editableRecipe.name}
                    onChange={handleChange}
                    variant="standard"
                />
            </Box>
            <Box sx={{ width: '50%' }}>
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

export function RecipeForm(props: RecipeFormProps) {
    const [recipe, setRecipe] = useState(newRecipe());
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmitStart = () => {
        setOpenDialog(true);
        setSubmitting(true);
        setSubmitSuccess(true);
    };

    const handleDialogClose = () => {
        if (submitSuccess) {
            navigate({
                pathname: '/recipes',
                search: ''
            });
        }
        setOpenDialog(false);
        setSubmitSuccess(true);
    };

    const handleChange = (recipe: Recipe) => {
        setRecipe(recipe);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        handleSubmitStart();
        fetch('/api/v1/recipes', {
            method: 'post',
            body: JSON.stringify(recipe)
        })
        .then(response => response.ok ? setSubmitSuccess(true) : setSubmitSuccess(false))
        .then(() => props.onRecipesChange?.())
        .finally(() => setSubmitting(false));        
        event.preventDefault();
    }

    return (
        <React.Fragment>
            <PageHeader pageName="Add Recipe" />

            <RecipeUpdateDialog open={openDialog} submitSuccess={submitSuccess} submitting={submitting} onClose={handleDialogClose} />

            <form onSubmit={handleSubmit}>
                <h1>Compose your Recipe</h1>
                <br />
                <RecipeEdit recipe={recipe} onChange={handleChange} />
                <p />
                <Button fullWidth variant="outlined" type="submit" value="Submit" color="primary">
                    Submit
                </Button>
                <p />
            </form>
        </React.Fragment>
    );
}

export function RecipeUpdateDialog(props: RecipeUpdateDialogProps) {

    const renderDialogText = (): string => {
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