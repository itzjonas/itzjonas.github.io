import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import Loading from './modules/Spinner';
import { name } from '../../package.json';

import '../less/main.less';

class App extends Component {
    constructor() {
        super();

        this.MS_INCREMENTS = 50;
        this.MAX_LOADING_MS = 200;

        this.state = {
            isLoading: true,
            msElapsed: 0
        };

        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        this.incrementer = setInterval(() =>
            this.setState({
                msElapsed: this.state.msElapsed + this.MS_INCREMENTS
            }),
        this.MS_INCREMENTS);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({ isLoading: false });

        clearInterval(this.incrementer);
    }

    render() {
        if (this.state.isLoading && this.state.msElapsed <= this.MAX_LOADING_MS) {
            return (<Loading color="#2DD155" />);
        } else if (this.state.isLoading && this.state.msElapsed > this.MAX_LOADING_MS) {
            return (<div className="failed">FAILED TO LOAD!</div>);
        }

        return (<Fragment>
            Welcome to <strong>{name}</strong>!
            <br /><br />
            🚧 Under Construction 🚧
        </Fragment>);
    }
}

render(<App />, document.getElementById('app'));
