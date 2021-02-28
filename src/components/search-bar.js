import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCog, faImage, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({search, searchString, resetSearch}) => {
    const ref = useRef(null);
    const inputRef = useRef('');
    const [open, setOpen] = useState(false);

    const deleteSearchString = () => {
        ref.current.reset();
        search('');
        setOpen(!open);
        resetSearch();
    }

    const handleToggle = e => {
        if (ref.current.contains(e.target)) {
            // inside click
            return;
        }
        // outside click
        setOpen(!open);
    }

    const selectedState = () => {
        if (open) {
            return {width: '400px'};
        }
        return {};
    }

    const selectedInputState = () => {
        if (open) {
            return {display: 'block'};
        }
        return {};
    }

    // handle dropdown behavior as it should (clicking outside of it should close, clicking options should as well)
    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleToggle);
        } else {
            document.removeEventListener("mousedown", handleToggle);
        }

        return () => {
            document.removeEventListener("mousedown", handleToggle);
        };
    }, [open]);

    return (
        <div className="column has-text-centered is-4">
            <form id="search-form" ref={ref} action="" style={selectedState()} onClick={() => setOpen(true)}>
                <input type="text" id="search-input" ref={inputRef} style={selectedInputState()}
                       onChange={(e) => search(e.target.value)} value={searchString}/>
                <div className="anim-icon">
                    {!open && <FontAwesomeIcon icon={faSearch}/>}
                    {open && <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => deleteSearchString(e)}/>}
                </div>
            </form>
        </div>
    );
}

export default SearchBar;
