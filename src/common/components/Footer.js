import React, { useContext } from 'react';
import { TextContext } from '../context/TextContext';
import { TextContextComponent } from '../context/TextContextProvider';

export function Footer(props) {

    const texts = useContext(TextContext);

    // draw a black line and the footer text
    return (
        <div className="Footer" style={{ textAlign: 'center' }}>
            <Blackline />
            <p>
                <TextContextComponent value='footerText' />
            </p>
        </div>
    );
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
