import React from 'react';
import icon from '../icons/clip-dark.png'
import cog from '../icons/cog.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCog, faImage } from '@fortawesome/free-solid-svg-icons'

const TopBar = (props) => {
    return (
        <div className="columns is-centered is-marginless">
            <div className="column is-4">
                
            </div>
            <div className="column has-text-centered is-4">
                <form action="">
                    <input type="search" onChange={(e) => props.search(e)} value={this.state.searchString}/>
                    <div className="anim-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </form>
            </div>
            <div className="column has-text-right is-4">
                <div className="dropdown is-right" onClick={(e) => props.onDropDown(e)}>
                    <div className="dropdown-trigger">
                        <FontAwesomeIcon className="icon-app" icon={faCog} size="lg" />
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                        <div className="dropdown-content">
                            <a className="dropdown-item" onClick={(e) => props.onDeleteAll(e)}>
                                Delete all
                            </a>
                            <hr className="dropdown-divider"/>>
                            <a className="dropdown-item">
                                Help
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
