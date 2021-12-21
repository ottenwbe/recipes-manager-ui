import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { PageHeader } from './PageHeader';
import { Link } from 'react-router-dom';
import config from "./strings.json";

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
                <CardHeader title={config.welcome} subheader={config.welcomeSub} style={{ textAlign: 'center', backgroundColor: "#2196f3" }} />
                <CardContent>
                    <Paper />

                        Look at all our recipes at:

                        <p>
                            <Link to="/recipes">Recipes</Link>
                        </p>

                        Or get a random Recipe at:

                        <p>
                            <Link to="/rand">Random Recipes</Link>
                        </p>
                </CardContent>
            </Card>
        </div>);
    }
}
