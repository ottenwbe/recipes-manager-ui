import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

const { REACT_APP_PAGE_HEADER_SUB } = process.env;

export class PageHeader extends Component {
    render() {
        return (<div style={{ paddingTop: 85, textAlign: 'center' }}>
            <Jumbotron>
                <h1>{this.props.pageName}</h1>
                <h3>{ REACT_APP_PAGE_HEADER_SUB }</h3>
            </Jumbotron>
        </div>);
    }
}
