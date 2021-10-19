import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import React, { Component } from 'react';
import { RecipeEdit } from './RecipeForm';


export class RecipeDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            recipe: JSON.parse(JSON.stringify(props.recipe)) //copy of original recipe
        };
    }

    setRecipe = (recipe) => {
        this.setState({ recipe: recipe });
    }

    handleChangedRecipe = (changedRecipe) => {
        this.setRecipe(changedRecipe);
    }

    submitRecipe = () => {
        this.setState({ loading: true })
        fetch('/api/v1/recipes/r/' + this.state.recipe.id, {
            method: 'put',
            body: JSON.stringify(this.state.recipe)
        })
            .then(() => this.props.onClose())
            .finally(() => this.setState({ loading: false }));
    }

    render() {
        return (
            <FormControl>
                <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="recpie-form-dialog-title">Edit Recipe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To edit the recipe, change the content and then submit the changes.
                    </DialogContentText>
                        <RecipeEdit disabled={this.state.loading} recipe={this.state.recipe} onChange={this.handleChangedRecipe} />
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={this.state.loading} onClick={this.props.onClose} color="primary">
                            Cancel
                    </Button>
                        {this.state.loading && <CircularProgress size={25} />}
                        <Button disabled={this.state.loading} onClick={this.submitRecipe} color="primary">
                            Submit
                    </Button>
                    </DialogActions>
                </Dialog>
            </FormControl>
        );
    }
}
