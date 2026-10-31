import type { ReactElement } from 'react';
import { TextContextComponent } from '@context/TextContextProvider';

interface FooterProps {
    className?: string;
}

export function Footer(props: FooterProps): ReactElement {
    // Draw a black line and the footer text
    return (
        <div className={props.className ?? "Footer"}>
            <hr className="footer-divider" />
            <p>
                <TextContextComponent value='footerText' />
            </p>
        </div>
    );
}
