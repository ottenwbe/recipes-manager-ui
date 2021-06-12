import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from "react-router-dom";
import { PageHeader } from './PageHeader';

export function NotFoundPage(props) {
    return (
        <div style={{ textAlign: 'center' }}>
            <PageHeader pageName="404" />
            <Typography variant="h4">
                Error - Something went wrong!
                <p />
                Go Back to Square One: <Link to="/recipes">Recipes</Link>
            </Typography>
        </div>
    );
}
