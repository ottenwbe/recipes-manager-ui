import Head from 'next/head'
import { Inter } from 'next/font/google'
import React, { Fragment, useContext } from 'react'
import 'react-dom'
import dynamic from 'next/dynamic'
import { TextContextProvider, TextFromContext, textFromContext } from '@/common/context/TextContextProvider'
import { TextContext } from '@/common/context/TextContext'
import { Footer } from '@/Footer'
import { CssBaseline } from '@mui/material'

// DynamicApp -> disable server side rendering for now until child pages are refactored
// currently document and window are used outside of 
const DynamicApp = dynamic(() => import('@/App'), {
  loading: () => <div style={{ textAlign: 'center' }}>Loading...</div>,
  ssr: false,
})

export default function Home() {
  return (
    <Fragment>
      <TextContextProvider>
        <HomeLayout />
      </TextContextProvider>
    </Fragment>
  )
}

function HomeLayout() {

  return (
    <Fragment>
      <Head>
        <title>{textFromContext('appName')}</title>
      </Head>
      <CssBaseline />
      <DynamicApp />
      <Footer />
    </Fragment>
  )
} 