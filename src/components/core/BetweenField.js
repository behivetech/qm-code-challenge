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
                name={name}
                ref={inputRef}
                type="hidden"
                value={`${firstValue} AND ${secondValue}`}
            />
            {error && <div className={getChildClass('error')}>{error.message}</div>}
        </div>
    );
}
