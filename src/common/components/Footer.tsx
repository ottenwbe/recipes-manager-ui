import type { ReactElement } from 'react';
import { TextContextComponent } from '@context/TextContextProvider';

interface FooterProps {
    className?: string;
}

export function Footer(props: FooterProps): ReactElement {
    // Draw a black line and the footer text
    return (
        <div className={props.className ?? "Footer"} style={{ textAlign: 'center' }}>
            <Blackline />
            <p>
                <TextContextComponent value='footerText' />
            </p>
        </div>
    );
}

function Blackline(): ReactElement {
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
