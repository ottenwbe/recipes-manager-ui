//import { makeStyles } from '@mui/material/styles';
import React from 'react';
//import Jumbotron from 'react-bootstrap/Jumbotron';
import config from "./strings.json";

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
    return (<div /*className={classes.header}*/>
        
            <h1>{props.pageName}</h1>
            <h3>{config.pageHeader.sub}</h3>
       
    </div>);
}
