import {useCallback, useEffect} from 'react';

const useOutsideClick = (ref, open, callback) => {
    const handleClick = useCallback(
        (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        },
        [callback, ref]
    );

    useEffect(() => {
        const eventListener = open ? 'addEventListener' : 'removeEventListener';

        document[eventListener]('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [handleClick, open]);
};

export default useOutsideClick;
