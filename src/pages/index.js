import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import App from '@/App'
import React from 'react'
import ReactDOM from 'react-dom';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  if (typeof window !== 'undefined') {
    return (
      <React.Fragment>
        <App />
      </React.Fragment>
    )
  }
} 
