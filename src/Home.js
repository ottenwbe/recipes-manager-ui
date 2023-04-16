import React from 'react';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { PageHeader } from './PageHeader';
import { Link } from 'react-router-dom';
import config from "./strings.json";

export function Home(props) {

        return (<React.Fragment>
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
        </React.Fragment>);
    
}
