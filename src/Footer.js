import React from 'react';

const { REACT_APP_PAGE_FOOTER_TEXT } = process.env;

export function Footer() {
    // draw a black line and the footer text
    return (<div className="Footer">
        <p><hr
            style={{
                color: 'black',
                backgroundColor: 'black',
                height: 1,
                width: 100
            }}
        /></p>
        <p>{REACT_APP_PAGE_FOOTER_TEXT}</p>
    </div>);
}
