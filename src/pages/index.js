import Head from 'next/head'
import { Inter } from 'next/font/google'
import React from 'react'
import 'react-dom'
import dynamic from 'next/dynamic'

// DynamicApp -> no server side rendering here
const DynamicApp = dynamic(() => import('@/App'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function Home() {

  return (
    <React.Fragment>
      <Head>
        <title>BeLa Recipes</title>
      </Head>
      <DynamicApp />
    </React.Fragment>
  )
} 
