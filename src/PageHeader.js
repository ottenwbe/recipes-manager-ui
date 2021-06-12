import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

const { REACT_APP_PAGE_HEADER_SUB } = process.env;

const useStyles = makeStyles(() => ({
    header: {
        paddingTop: 0,
        align: 'center',
        textAlign: 'center'
    }
}));

export function PageHeader(props) {

    const classes = useStyles();

    return (<div className={classes.header}>
        <Jumbotron>
            <h1>{props.pageName}</h1>
            <h3>{REACT_APP_PAGE_HEADER_SUB}</h3>
        </Jumbotron>
    </div>);
}
