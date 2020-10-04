import React from 'react';

const { REACT_APP_PAGE_FOOTER_TEXT } = process.env;

export function Footer() {
    return (<div className="Footer">
        <p>{ REACT_APP_PAGE_FOOTER_TEXT }</p>
    </div>);
}
