import { Fragment, Suspense, lazy } from 'react';
import { TextContextProvider } from '@context/TextContextProvider';
import { CssBaseline } from '@mui/material';

const DynamicApp = lazy(() => import('@components/App'));

export default function Home(): React.JSX.Element {
  return (
    <Fragment>
      <TextContextProvider>
        <HomeLayout />
      </TextContextProvider>
    </Fragment>
  )
}

function HomeLayout(): React.JSX.Element {
  
  return (
    <Fragment>
      <CssBaseline />
      <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
            <DynamicApp />
      </Suspense>
    </Fragment>
  )
}
