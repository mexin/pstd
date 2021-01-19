import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ClipboardCard = (props) => {
    const image = <img src={props.data} width="300px" />
    return (
        <div className="card">
            <div className="card-content"  onClick={(e) => props.onClicked(e, props)}>
                <div className="content">
                    {props.type === 'image' ? image : props.data}
                </div>
            </div>
            <footer className="card-footer">
                <time className="card-footer-item">
                    <span>
                    {moment(props.date).fromNow()}
                    </span>
                </time>
                <div className="card-footer-item" onClick={(e) => props.onDelete(e, props)}>
                    <span>
                    <FontAwesomeIcon icon={faTrashAlt}/>
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default ClipboardCard;