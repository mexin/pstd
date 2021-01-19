import React from 'react'
import ReactDOM from 'react-dom'
import db from './api/db';
import TopBar from './components/top-bar'
import ClipboardCard from './components/card';
import emptyIcon from './icons/empty.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'
const clipboardWatcher = require('electron-clipboard-watcher2')
const clipboard = window.require('electron').clipboard;
const { remote, BrowserWindow, nativeImage } = window.require('electron');
const currentWindow = remote.getCurrentWindow();
require('babel-polyfill');
import 'bulma/css/bulma.min.css'
import './style.css';

document.documentElement.setAttribute(
    'data-theme',
    localStorage.theme || 'dark'
);
// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            filtered: [],
            searching: false,
            searchString: '',
        }
    }

    async componentDidMount() {
        const self = this;
        // retrive all clips sorted by newest to oldest
        const savedClips = await db.clips.find({}).sort({ date: 1 });
        this.setState({
            history: [...this.state.history, ...savedClips]
        });
        clipboardWatcher({
            // (optional) delay in ms between polls
            watchDelay: 500,
            // handler for when image data is copied into the clipboard
            onImageChange(nativeImage) {
                const image = nativeImage.toDataURL()
                self.checkClipboard(image, 'image');
            },
            // handler for when text data is copied into the clipboard
            onTextChange(text) {
                self.checkClipboard(text.text, 'text');
            }
        });
    }

    quitApp = (e) => {
        remote.app.exit();
    }

    dropDownTrigger = (e) => {
        // required for bulma dropdowns https://stackoverflow.com/a/46787371
        e.stopPropagation();
        const dropdown = document.querySelector('.dropdown');
        dropdown.classList.toggle('is-active');
    }

    checkClipboard = async (data, type) => {
        const historyLen = this.state.history.length;
        // todo avoid adding copied elements from nautilus, need to check other platforms!
        if (data !== '') {
            // avoid adding same copied text many times by checking last element, also check db to avoid duplicates
            const exists = await db.clips.findOne({ type, data });
            if ((this.state.history.length === 0 || this.state.history[historyLen - 1].data !== data) && exists === null) {
                const date = new Date();
                let cDoc = await db.clips.findOne({ type, data });
                if (cDoc === null) {
                    cDoc = await db.clips.insert({ type, data, date: date.toISOString() });
                }
                this.setState({
                    history: [...this.state.history, {
                        _id: cDoc._id,
                        type,
                        data,
                        date: date.toISOString()
                    }]
                });
            }
        }
    }

    cardClicked = (e, card) => {
        if (card.type === 'text') {
            clipboard.writeText(card.data);
        } else {
            clipboard.writeImage(nativeImage.createFromDataURL(card.data));
        }
        new Notification('PSTD', {
            body: 'Text copied'
        });
        currentWindow.hide();
        // remove search state and string
        this.setState({ searchString: '', searching: false });
    }

    deleteCard = async (e, card) => {
        console.log(e, card);
        const index = this.state.history.map(function(e) { return e._id; }).indexOf(card._id);
        this.state.history.splice(index, 1);
        this.setState({
            history: [...this.state.history],
        });
        await db.clips.remove({ _id: card._id });
    }

    deleteAll = async (e, props) => {
        this.setState({
            history: [],
        });
        await db.clips.remove({}, { multi: true });
    }

    search = (e, props) => {
        let newList = [];
        let currentList = [];
        if (e.target.value !== '') {
            this.setState({ searching: true, searchString: e.target.value });
            currentList = this.state.history;
            newList = currentList.filter(item => {
                if (item.type === 'text') {
                    const lc = item.data.toLowerCase();
                    const filter = e.target.value.toLowerCase();
                    if (lc.includes(filter)) {
                        return item;
                    }
                }
            });
        } else {
            // remove search state and text
            this.setState({ searching: false, searchString: '' });
        }
        this.setState({
            filtered: newList,
        });
    }

    render() {
        let clips;
        if (!this.state.searching) {
            clips = this.state.history.map((clip, key) =>
                <ClipboardCard key={key}
                    _id={clip._id}
                    type={clip.type}
                    data={clip.data}
                    date={clip.date.toString()}
                    onClicked={this.cardClicked}
                    onDelete={this.deleteCard}
                />
            );
        } else {
            clips = this.state.filtered.map((clip, key) =>
                <ClipboardCard key={key}
                    _id={clip._id}
                    type={clip.type}
                    data={clip.data}
                    date={clip.date.toString()}
                    onClicked={this.cardClicked}
                    onDelete={this.deleteCard}
                />
            );
        }
        const emptyCard = <div className="content empty-box">
            <div className="content has-text-centered">
                < FontAwesomeIcon className="icon-app" icon={faClipboard} size="3x" />
                <p className="is-info">
                    <small> {this.state.searching ? 'No matching results' : 'Empty clipboard'} </small>
                </p>
            </div>
        </div>;
        const nonEmpty = <div className="scroller">
            <footer className="footer">
                <div className="content has-text-centered"> {clips.slice().reverse()} </div>
            </footer>
        </div> 
        return (<div>
            <TopBar search={this.search} searchString={this.state.searchString} onDropDown={this.dropDownTrigger} onDeleteAll={this.deleteAll} quitApp={this.quitApp}/>
            {clips.length > 0 ? nonEmpty : emptyCard}
        </div>
        )
    }
}

ReactDOM.render(< App />, document.getElementById('root'));