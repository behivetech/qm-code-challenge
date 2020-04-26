import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

import getClassName from '../../tools/getClassName';

import './Button.scss';

export default function Button({
    children,
    className,
    disabled,
    icon,
    onClick,
    small,
    secondary,
    ...props
}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        modifiers: {
            disabled,
            secondary,
            small,
        },
        rootClass: 'button',
    });

    return (
        <button
            {...props}
            className={rootClassName}
            disabled={disabled}
            onClick={onClick}
        >
            {icon && <Icon className={getChildClass('icon')} icon={icon} />}
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    /* Sets button to disabled */
    disabled: PropTypes.bool,
    /* Adds a material icon to the button */
    icon: PropTypes.string,
    onClick: PropTypes.func,
    /* Modifier to produce a small button */
    small: PropTypes.bool,
    /* Modifier to produce a secondary styled button */
    secondary: PropTypes.bool,
};

Button.defaultProps = {
    onClick: () => null,
};
