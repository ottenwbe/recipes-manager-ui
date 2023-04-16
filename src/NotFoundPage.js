import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from "react-router-dom";
import { PageHeader } from './PageHeader';

export function NotFoundPage(props) {
    return (
        <div style={{ textAlign: 'center' }}>
            <PageHeader pageName="404" />
            <Typography variant="h6">
                Error - Something went wrong!
                <p />
                Go Back to Square One!
                <p />
                <Link to="/recipes">Recipes</Link>
            </Typography>
        </div>
    );
}
