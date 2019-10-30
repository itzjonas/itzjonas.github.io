import React, { Fragment, useEffect, useState } from 'react';
import { render } from 'react-dom';

import { useLoading } from './utils/hooks';
import Loading from './modules/Spinner';
import { name } from '../../package.json';

import '../less/main.less';

function App () {
    const [loading, load] = useLoading();

    function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    useEffect(() => {
        load(sleep(2000)); // fake a loading
    }, []);

    if (loading) {
        return (<Loading color="#2DD155" />);
    }

    return (
        <Fragment>
            Welcome to <strong>{name}</strong>!
            <br /><br />
            🚧 Under Construction 🚧
        </Fragment>
    );
}

render(<App />, document.getElementById('app'));
