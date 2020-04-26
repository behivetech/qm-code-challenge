import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

import getClassName from '../../tools/getClassName';

import './ButtonClose.scss';

export default function ButtonClose({className, onClick}) {
    const [rootClassName] = getClassName({
        className,
        rootClass: 'button-close',
    });

    return (
        <button onClick={onClick} className={rootClassName}>
            <Icon icon="close" />
        </button>
    );
}

ButtonClose.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

ButtonClose.defaultProps = {
    onClick: () => null,
};
