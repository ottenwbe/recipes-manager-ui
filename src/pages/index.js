import Head from 'next/head'
import { Inter } from 'next/font/google'
import React, { useEffect, Fragment } from 'react'
import 'react-dom'
import dynamic from 'next/dynamic'

// DynamicApp -> disable server side rendering for now until child pages are refactored
// currently document and window are used outside of 
const DynamicApp = dynamic(() => import('@/App'), {
  loading: () => <div style={{ textAlign: 'center' }}>Loading...</div>,
  ssr: false,
})

export default function Home() {

  const [textConfig, settextConfig] = React.useState({});

  const updateTexts = (newTexts) => {
    if (JSON.stringify(newTexts) !== JSON.stringify(textConfig)) {
      settextConfig(newTexts);
    }
  };

  useEffect(() => {
    fetch('strings.json')
      .then(response => response.json())
      .then(json => updateTexts(json))
      .catch(error => console.log(error));
  });

  return (
    <Fragment>
      <Head>
        <title>{textConfig.hasOwnProperty('appName') ? textConfig.appName : ''}</title>
      </Head>
      <DynamicApp textConfig={textConfig} />
    </Fragment>
  )
} 
