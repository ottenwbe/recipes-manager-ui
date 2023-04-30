import Head from 'next/head'
import { Inter } from 'next/font/google'
import App from '@/App'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  if (typeof window !== 'undefined') {
    return (
      <React.Fragment>
        <Head>
          <title>BeLa Recipes</title>
        </Head>        
        <App />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <Head>
          <title>BeLa Recipes</title>
        </Head>        
      </React.Fragment>      
    )
  }
} 
