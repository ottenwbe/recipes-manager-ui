import { saveToken } from '@src/common/components/Login';
import { Fragment, useEffect } from 'react';

export default function LoginRedirect() {

    useEffect(() => {

        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);

        saveToken(params.get('token'));
        
        navigateToHome();
    }, []);

    return (
        <Fragment> Loging In ... </Fragment>
    )
}

function navigateToHome() {
    window.location.replace('/');
}