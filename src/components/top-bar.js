import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCog, faImage } from '@fortawesome/free-solid-svg-icons'
import icon from '../icons/clip-dark.png'

const TopBar = ({ search, searchString, onDeleteAll, quitApp }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = e => {
    if (ref.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(!open)
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
        <div className="columns is-centered is-marginless">
            <div className="column is-4">

            </div>
            <div className="column has-text-centered is-4">
                <form action="">
                    <input type="search" id="search-input" onChange={(e) => search(e)} value={searchString}/>
                    <div className="anim-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </form>
            </div>
            <div className="column has-text-right is-4">
                <div ref={ref} className={"dropdown is-right has-text-left" + (!open ? "" : " is-active")} onClick={() => setOpen(!open)}>
                    <div className="dropdown-trigger">
                        <FontAwesomeIcon className="icon-app" icon={faCog} size="lg" />
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                        <div className="dropdown-content">
                            <a className="dropdown-item" onClick={(e) => onDeleteAll(e)}>
                                Delete all
                            </a>
                            <hr className="dropdown-divider"/>
                            <a className="dropdown-item">
                                Help
                            </a>
                            <a className="dropdown-item" onClick={(e) => quitApp(e)}>
                                Quit
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
