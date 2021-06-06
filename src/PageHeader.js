import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

const { REACT_APP_PAGE_HEADER_SUB } = process.env;

export function PageHeader(props) {
    return (<div style={{ paddingTop: 0, textAlign: 'center' }}>
        <Jumbotron>
            <h1>{props.pageName}</h1>
            <h3>{REACT_APP_PAGE_HEADER_SUB}</h3>
        </Jumbotron>
    </div>);
}
