import React, { Fragment, useCallback } from 'react';
import 'react-dom'
import { Footer } from '@components/Footer'
import { CssBaseline } from '@mui/material'
import { TextContextComponent, TextContextProvider } from '@context/TextContextProvider';
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

export default function Home(): React.JSX.Element {
    return (
        <TextContextProvider>
            <HomeLayout />
        </TextContextProvider>
    )
}

function HomeLayout(): React.JSX.Element {
    return (
        <Fragment>
            <CssBaseline />
            <Container>
                <Box sx={{ height: '90vh' }}>
                    <SignUpComponents />
                </Box>
                <Footer />
            </Container>
        </Fragment>
    )
}

function SignUpComponents(): React.JSX.Element {
    const keyCloakSignUp = useCallback((): void => {
        window.location.replace('/api/v1/auth/keycloak/login?signup=true');
    }, []);

    const keyCloakLogin = useCallback((): void => {
        window.location.replace('/api/v1/auth/keycloak/login');
    }, []);

    return (
        <Stack sx={{ height: '90vh', alignItems: 'stretch', flexDirection: 'column', flexWrap: 'wrap' }} useFlexGap>
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
    );
}
