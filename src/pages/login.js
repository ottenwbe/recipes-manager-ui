import { saveToken } from '@src/common/components/Security';
import { Fragment, useEffect } from 'react';

export default function Login() {

    useEffect(() => {

        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);

        saveToken(params.get('token'));

        window.location.replace('/')

    }, []);

    return (
        <Fragment> Login ... </Fragment>
    )
}
