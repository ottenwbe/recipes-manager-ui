import { TextContext } from '@context/TextContext'
import type { TextConfig } from '@context/TextContext'
import config from '@public/strings.json'
import React, { useEffect, useContext } from 'react'

interface TextContextProviderProps {
    children: React.ReactNode;
}

interface TextContextComponentProps {
    value: keyof TextConfig;
}

export function TextContextProvider({ children }: TextContextProviderProps): React.JSX.Element {
    const [textConfig, setTextConfig] = React.useState<TextConfig>(config);

    const updateTexts = (newTexts: TextConfig) => {
        if (JSON.stringify(newTexts) !== JSON.stringify(textConfig)) {
            setTextConfig(newTexts);
        }
    };

    useEffect(() => {
        fetch('strings.json')
            .then(response => response.json())
            .then(json => updateTexts(json))
            .catch(error => console.log(error));
    });

    return (
        <TextContext.Provider value={textConfig}>
            {children}
        </TextContext.Provider>
    )
}

export function textFromContext(texts: TextConfig, value: keyof TextConfig): string {

    if (Object.prototype.hasOwnProperty.call(texts, value)) {
        return texts[value];
    }
    return '';
}

export function TextContextComponent(props: TextContextComponentProps): React.JSX.Element {

    const texts = useContext(TextContext);

    return (
        <React.Fragment>
            {textFromContext(texts, props.value)}
        </React.Fragment>
    );
}