import React from 'react';
import PropTypes from 'prop-types';

import getClassName from '../../tools/getClassName';

import './Card.scss';

export default function Card({cardRef, children, className, elevated, fullBleed}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {
            elevated,
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
    /** Adds a ref to the card */
    cardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    /** Adds a box shadow to the card */
    elevated: PropTypes.bool,
    /** Removes padding from the card */
    fullBleed: PropTypes.bool,
};
