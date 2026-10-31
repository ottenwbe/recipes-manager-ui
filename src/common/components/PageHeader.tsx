import Box from '@mui/material/Box';
import { TextContextComponent } from '../context/TextContextProvider';

interface PageHeaderProps {
    pageName: string;
}

export function PageHeader(props: PageHeaderProps) {
    return (<div style={{ textAlign: 'center' }} /*className={classes.header}*/>
            <Box sx={{ pt: 4 }}>
                <h1>{props.pageName}</h1>
                <h3><TextContextComponent value='pageHeaderSub'/></h3>
            </Box>
    </div>);
}
