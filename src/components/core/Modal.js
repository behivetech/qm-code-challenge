import React, {useRef} from 'react';
import PropTypes from 'prop-types';

import ButtonClose from './ButtonClose';
import Card from './Card';

import getClassName from '../../tools/getClassName';
import useOutsideClick from '../../hooks/useOutsideClick';

import './Modal.scss';

export default function Modal({className, children, fullBleed, onClose, open}) {
    const thisRef = useRef(null);

    useOutsideClick(thisRef, open, () => onClose(false));

    const [rootClassName, getChildClass] = getClassName({
        className,
        modifiers: {
            open,
        },
        rootClass: 'modal',
    });

    function handleClick(event) {
        event.preventDefault();
        onClose(false);
    }

    return (
        <div className={rootClassName}>
            <div className={getChildClass('overlay')} />
            <div className={getChildClass('container')}>
                <Card className={getChildClass('card')} fullBleed cardRef={thisRef}>
                    <ButtonClose
                        className={getChildClass('close')}
                        onClick={handleClick}
                    />
                    {children}
                </Card>
            </div>
        </div>
    );
}

Modal.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    /** Removes padding from the modal */
    fullBleed: PropTypes.bool,
    /** Callback function to kick off when the modal is closing */
    onClose: PropTypes.func,
    /** Indicates if the modal is open or not */
    open: PropTypes.bool,
};

Modal.defaultProps = {
    onClose: () => null,
    open: false,
};
