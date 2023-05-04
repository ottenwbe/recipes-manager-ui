//import { makeStyles } from '@mui/material/styles';
import React from 'react';
//import Jumbotron from 'react-bootstrap/Jumbotron';
import Box from '@mui/material/Box';
import { TextContextComponent } from '../context/TextContextProvider';

/*const useStyles = makeStyles(() => ({
    header: {
        paddingTop: 0,
        align: 'center',
        textAlign: 'center'
    }
}));*/

export function PageHeader(props) {

   // const classes = useStyles();
 //</Jumbotron>//<Jumbotron>
    return (<div style={{ textAlign: 'center' }} /*className={classes.header}*/>
            <Box sx={{ pt: 4 }}>
                <h1>{props.pageName}</h1>
                <h3><TextContextComponent value='pageHeaderSub'/></h3>
            </Box>
    </div>);
}
