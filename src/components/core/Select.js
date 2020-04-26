import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import SelectListItem from './SelectListItem';
import TextField from './TextField';

import getClassName from '../../tools/getClassName';
import useOutsideClick from '../../hooks/useOutsideClick';

import './Select.scss';

export default function Select({
    className,
    getOptions,
    inputRef,
    name,
    onChange,
    onExpand,
    selected,
    ...props
}) {
    const inputButton = useRef(null);
    const [open, setOpen] = useState(false);
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'select',
    });

    useOutsideClick(inputButton, open, () => {
        setOpen(false);
    });

    function handleFieldClick() {
        setOpen(!open);
        onExpand();
    }

    function handleListItemClick(selectedItem) {
        onChange(selectedItem);
    }

    function renderList() {
        const options = getOptions();
        const cardContents = options.length ? (
            <ul className={getChildClass('ul')}>
                {getOptions().map((option) => (
                    <SelectListItem
                        key={option.value}
                        onClick={handleListItemClick}
                        value={option}
                    />
                ))}
            </ul>
        ) : (
            <div className={getChildClass('no-options')}>No options available</div>
        );

        return (
            <Card fullBleed className={getChildClass('card')}>
                {cardContents}
            </Card>
        );
    }

    return (
        <div className={rootClassName}>
            <TextField
                inputRef={inputButton}
                onClick={handleFieldClick}
                readOnly
                type="button"
                value={selected.displayValue}
                {...props}
            />
            {open && renderList()}
            <input value={selected.value} name={name} ref={inputRef} type="hidden" />
        </div>
    );
}

Select.propTypes = {
    className: PropTypes.string,
    getOptions: PropTypes.func,
    inputRef: PropTypes.func,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
    selected: PropTypes.shape({
        displayValue: PropTypes.string,
        value: PropTypes.string,
    }),
};

Select.defaultProps = {
    getOptions: () => [],
    onChange: () => null,
    onExpand: () => null,
    selected: {displayValue: '', value: ''},
};
