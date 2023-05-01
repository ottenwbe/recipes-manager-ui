import React from 'react';

export function Footer(props) {
    // draw a black line and the footer text
    return (<div className="Footer" style={{ textAlign: 'center' }}>
        <Blackline />
        <p>{props.textConfig.hasOwnProperty('footer') && props.textConfig.footer.hasOwnProperty('text')  ? props.textConfig.footer.text : 'no footer'}</p>
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
