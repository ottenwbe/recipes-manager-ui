import React from 'react';
import config from "./strings.json";

export function Footer() {
    // draw a black line and the footer text
    return (<div className="Footer">
        <Blackline />
        <p>{config.footer.text}</p>
    </div>);
}

function Blackline() {
    return (
        <hr
            style={{
                color: 'black',
                backgroundColor: 'black',
                height: 1,
                width: 100
            }}
        />
    );
}
