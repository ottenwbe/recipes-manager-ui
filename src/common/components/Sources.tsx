import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { PageHeader } from './PageHeader';
import CircularProgress from '@mui/material/CircularProgress';

interface SourceProps {
    source: any;
}

interface SourcesProps {
}

interface SourcesState {
    sources: Record<string, SourceProps> | null;
}

export class Sources extends Component<SourcesProps, SourcesState> {

    state: SourcesState = {
        sources: null,
    };

    componentDidMount(): void {
        fetch('/api/v1/sources')
            .then(response => response.json())
            .then(responseJSON => this.setState({ sources: responseJSON }))
            .catch(error => console.log(error));
    }

    render(): React.JSX.Element {
        return (<div>
            <PageHeader pageName="Recipe Sources" />
            {this.state.sources != null ? Object.values(this.state.sources).map((val, index) => <Source key={index} source={val} />) : "No Sources Found"}
        </div>);
    }
}

function Source(props: SourceProps): React.JSX.Element {

    const [loading, setLoading] = React.useState(false);

    const onConnectClick = (): void => {
        console.log(window.location.href);
        fetch('/api/v1/sources/' + props.source.id + '/connect?redirect=' + encodeURIComponent(window.location.href) )
            .then(response => response.json())
            .then(responseJSON => window.location.href = responseJSON.oAuthURL)
            .catch(err => console.error(err));
    };

    const onSyncClick = (): void => {
        setLoading(true)
        fetch('/api/v1/sources/' + props.source.id + '/recipes', {
            method: 'PATCH'
        }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    };

    return (<div>
        <Card style={{ align: 'center' }}>
            <CardHeader title={props.source.name} style={{ textAlign: 'center', backgroundColor: "#2196f3" }} />
            <CardContent>
                <Button variant="contained" disabled={loading} color="primary" onClick={onConnectClick}>Connect</Button>
                <Button variant="contained" disabled={!props.source.connected || loading} onClick={onSyncClick} color="primary">Import</Button>
                {loading && <CircularProgress size={45} />}
            </CardContent>
        </Card>
    </div>);
}
