import { Fragment, Suspense, lazy } from 'react';
import { TextContextProvider } from '@context/TextContextProvider';
import { CssBaseline } from '@mui/material';

// DynamicApp -> disable server side rendering for now until child pages are refactored
// currently document and window are used outside of 
const DynamicApp = lazy(() => import('@components/App'))

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
      <CssBaseline />
      <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
            <DynamicApp />
      </Suspense>
    </Fragment>
  )
} 