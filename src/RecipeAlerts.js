import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export function RecipeAlert(props) {
    const classes = useStyles();

    const handleClose = () => { props.onClose() }

    return (
        <div className={classes.root}>
            <Collapse in={props.enabled}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                >
                    {props.message}
                </Alert>
            </Collapse>
        </div>
    );
}