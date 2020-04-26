import React from 'react';
import PropTypes from 'prop-types';

import getClassName from '../../tools/getClassName';

import './Card.scss';

export default function Card({cardRef, children, className, fullBleed}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {
            'no-padding': fullBleed,
        },
        rootClass: 'card',
    });

    return (
        <div ref={cardRef} className={rootClassName}>
            {children}
        </div>
    );
}

Card.propTypes = {
    cardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    fullBleed: PropTypes.bool,
};
