import React from 'react';
import PropTypes from 'prop-types';

import getClassName from '../../tools/getClassName';

import './TextField.scss';

export default function TextField({
    className,
    error,
    inputRef,
    rightAligned,
    type,
    ...props
}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        modifiers: {
            'right-aligned': type === 'number' || rightAligned,
        },
        rootClass: 'text-field',
    });

    return (
        <div className={rootClassName}>
            <input
                className={getChildClass('input')}
                ref={inputRef}
                type={type}
                {...props}
            />
            {error && <div className={getChildClass('error')}>{error.message}</div>}
        </div>
    );
}

TextField.propTypes = {
    className: PropTypes.string,
    /* If set, this will display an error below the text field */
    error: PropTypes.object,
    /* Sets text in input right aligned */
    rightAligned: PropTypes.bool,
    /* Sets the type of input and if number it sets it to right aligned */
    type: PropTypes.string,
};

TextField.defaultProps = {
    type: 'text',
};
