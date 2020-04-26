import React from 'react';
import PropTypes from 'prop-types';

import getClassName from '../../tools/getClassName';

import './SelectListItem.scss';

export default function SelectListItem({className, onClick, value}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'select-list-item',
    });

    function handleValueClick(event) {
        event.preventDefault();
        onClick(value);
    }

    return (
        <li className={rootClassName}>
            <button className={getChildClass('li-button')} onClick={handleValueClick}>
                {value.displayValue}
            </button>
        </li>
    );
}

SelectListItem.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    value: PropTypes.shape({
        displayValue: PropTypes.string,
        value: PropTypes.string,
    }),
};
