import React from 'react';
import PropTypes from 'prop-types';

import getClassName from '../../tools/getClassName';

import './Icon.scss';

export default function Icon({
    className,
    icon,
    onPrimary,
    onSecondary,
    spinning,
    ...props
}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {
            'on-primary': onPrimary,
            'on-secondary': onSecondary,
            spinning,
        },
        rootClass: 'icon',
    });

    return (
        <i {...props} className={rootClassName}>
            {icon}
        </i>
    );
}

Icon.propTypes = {
    className: PropTypes.string,
    /** The icon to use. This can be a string for a font icon, a url, or whatever the selected strategy needs. */
    icon: PropTypes.string,
    /** Adds class to use the MDC theme on-primary text color */
    onPrimary: PropTypes.bool,
    /** Adds class to use the MDC theme on-secondary text color */
    onSecondary: PropTypes.bool,
    /** Adds a rotation css value to the icon */
    spinning: PropTypes.bool,
};

Icon.defaultProps = {
    icon: 'menu',
};
