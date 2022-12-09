import React, { useRef, useEffect } from "react";


/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref, isSelected, unselect) {

    function handleClickOutside(event) {

        if (!isSelected) {
            return;
        }
        if (ref.current && !ref.current.contains(event.target)) {
            unselect();
        }
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [ref, isSelected]);
}
