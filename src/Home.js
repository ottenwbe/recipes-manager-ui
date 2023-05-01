import React from 'react';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { PageHeader } from './PageHeader';
import { Link } from 'react-router-dom';
import { textFromContext } from './common/context/TextContextProvider';

export function Home(props) {

        const texts = useContext(TextContext);

        return (<React.Fragment>
            <PageHeader pageName="Recipe News" />
            <Card style={{ align: 'center' }}>
                <CardHeader title={textFromContext(texts, 'welcome')} subheader={textFromContext(texts, 'welcomeSub')} style={{ textAlign: 'center', backgroundColor: "#2196f3" }} />
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
