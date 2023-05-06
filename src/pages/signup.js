import Head from 'next/head'
import React, { Fragment, useContext } from 'react'
import 'react-dom'
import { Footer } from '@components/Footer'
import { CssBaseline } from '@mui/material'
import { TextContextComponent, TextContextProvider, TextFromContext, textFromContext } from '@context/TextContextProvider'
import { TextContext } from '@context/TextContext'
import { Container } from 'react-bootstrap'
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import KeyIcon from '@mui/icons-material/Key';
import { Box } from '@mui/system'

const Item = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(to right bottom, #000, #430089)',
    color: '#fff',
    padding: theme.spacing(1),
    textAlign: 'center',
    flexGrow: 1,
}));

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

    const texts = useContext(TextContext);

    const keyCloakSignUp = () => {
        console.log('click keycloak sign up')
    };
    const keyCloakLogin = () => { console.log('click keycloak log in') };

    return (
        <Fragment>
            <Head>
                <title>{textFromContext(texts, 'appName')}</title>
            </Head>
            <CssBaseline />
            <Container>
                <Box height="90vh" >
                    <Stack height="90vh" alignItems="stretch" direction="column" useFlexGap flexWrap="wrap">
                        <Item sx={{ width: '100%' }}>
                            <h1><TextContextComponent value='appName' /></h1>
                            <h2><TextContextComponent value='signupAd' /></h2>
                            <p />
                            <Button onClick={keyCloakSignUp} variant="contained" endIcon={<KeyIcon />}>
                                <h3><TextContextComponent value='signupKeyCloak' /></h3>
                            </Button>
                            <p />
                            <Button
                                variant="text"
                                onClick={keyCloakLogin} >
                                <TextContextComponent value='loginKeyCloak' />
                            </Button>
                        </Item>
                    </Stack>
                </Box>
                <Footer />
            </Container>
        </Fragment>
    )
} 