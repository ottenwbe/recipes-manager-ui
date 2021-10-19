import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { PageHeader } from './PageHeader';
import CircularProgress from '@material-ui/core/CircularProgress';

export class Sources extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            sources: null,
        };
    }

    componentDidMount() {
        fetch('/api/v1/sources')
            .then(response => response.json())
            .then(responseJSON => this.setState({ sources: responseJSON }));
    }

    render() {
        return (<div>
            <PageHeader pageName="Recipe Sources" />
            {this.state.sources != null ? Object.values(this.state.sources).map((val, index) => <Source key={index} source={val} />) : "No Sources Found"}
        </div>);
    }
}

function Source (props) {

    const [loading, setLoading] = React.useState(false);

    const onConnectClick = () => {
        console.log(window.location.href);
        fetch('/api/v1/sources/' + props.source.id + '/connect?redirect=' + encodeURIComponent(window.location.href) )
            .then(response => response.json())
            .then(responseJSON => window.location.href = responseJSON.oAuthURL)
            .catch(err => console.error(err));
    };
    
    const onSyncClick = () => {
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
