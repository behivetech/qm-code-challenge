import React, {useState} from 'react';
import PropTypes from 'prop-types';

import TextField from './TextField';

import getClassName from '../../tools/getClassName';

import './BetweenField.scss';

export default function BetweenField({
    className,
    error,
    inputRef,
    name,
    onChange,
    rightAligned,
    ...props
}) {
    const [firstValue, setFirstValue] = useState('');
    const [secondValue, setSecondValue] = useState('');
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'between-field',
    });

    function handleFirstChange(event) {
        setFirstValue(event.target.value);
    }

    function handleSecondChange(event) {
        setSecondValue(event.target.value);
    }

    return (
        <div className={rootClassName}>
            <TextField type="number" onChange={handleFirstChange} rightAligned />
            <div className={getChildClass('and')}>and</div>
            <TextField type="number" onChange={handleSecondChange} rightAligned />
            <input
                {...props}
                onChange={onChange}
                name={name}
                ref={inputRef}
                type="hidden"
                value={`${firstValue} AND ${secondValue}`}
            />
            {error && <div className={getChildClass('error')}>{error.message}</div>}
        </div>
    );
}

BetweenField.propTypes = {
    className: PropTypes.string,
    /** Displays an error if set */
    error: PropTypes.object,
    inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /** Name on input */
    name: PropTypes.string,
    /** Callback function when input has a change */
    onChange: PropTypes.func,
    /** Sets the text in the text fields right aligned */
    rightAligned: PropTypes.bool,
};

BetweenField.defaultProps = {
    onChange: () => null,
};
