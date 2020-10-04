import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { PageHeader } from './PageHeader';


const { REACT_APP_WELCOME_TEXT, REACT_APP_WELCOME_SUB_TEXT } = process.env;

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            value: '',
            portions: 1
         };
    }

    render() {
        return (<div>
            <PageHeader pageName="Recipe News" />
            <Card style={{ align: 'center' }}>
                <CardHeader title={REACT_APP_WELCOME_TEXT} subheader={REACT_APP_WELCOME_SUB_TEXT} style={{ textAlign: 'center', backgroundColor: "#2196f3" }} />
                <CardContent>
                    <Paper />

                        Look at all our recipes at:

                        <p>
                            <li><a href="#!/recipes">Recipes</a></li>
                        </p>

                        Or get a random Recipe at:

                        <p>
                            <li><a href="#!/rand">Random Recipe</a></li>
                        </p>
                </CardContent>
            </Card>
        </div>);
    }
}
