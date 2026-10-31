import Collapse from '@mui/material/Collapse';
//import { makeStyles } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

interface RecipeAlertProps {
    enabled: boolean;
    message: string;
    onClose: () => void;
}

/*const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));*/

export function RecipeAlert(props: RecipeAlertProps) {
    //const classes = useStyles();

    const handleClose = () => { props.onClose() }

    return (
        <div /*className={classes.root}*/>
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