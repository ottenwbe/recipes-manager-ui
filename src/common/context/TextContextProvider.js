import { TextContext } from './TextContext'
import React, { useEffect, Children, useContext } from 'react'

export function TextContextProvider({ children }) {
    const [textConfig, setTextConfig] = React.useState({});

    const updateTexts = (newTexts) => {
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

export function textFromContext(value) {

    const texts = useContext(TextContext);

    if (texts.hasOwnProperty(value)) {
        return texts[value];
    } 
    return '';
}

export function TextContextComponent(props) {

    const texts = useContext(TextContext);

    return (
        <React.Fragment>
            {textFromContext(props.value)}
        </React.Fragment>
    );
}