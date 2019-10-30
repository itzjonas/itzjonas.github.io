import React from 'react';
import PropTypes from 'prop-types';

import './Spinner.less';

/**
 * Requires spin keyframe
 */
export default function Spinner({
    alt,
    className,
    color,
    width,
    ...other
}) {
    const styles = {
        WebkitAnimation: 'spin 1s linear infinite',
        MozAnimation: 'spin 1s linear infinite',
        animation: 'spin 1s linear infinite',
    };

    return (
        <svg
            alt={alt}
            style={styles}
            viewBox="0 0 34 34"
            width={width}
            {...other}
        >
            <path
                stroke={color}
                strokeWidth="2"
                fill="none"
                transform="translate(-63, -63)"
                d="M96,80 C96,88.8 88.8,96 80,96 C71.2,96 64,88.8 64,80 C64,71.2 71.2,64 80,64 C86.24,64 91.68,67.52 94.24,72.8"
            />
        </svg>
    );
}

Spinner.defaultProps = {
    alt: 'loading...',
    color: '#DADCDF',
    width: '34px'
};

Spinner.propTypes = {
    alt: PropTypes.string,
    color: PropTypes.string,
    width: PropTypes.string,
};
