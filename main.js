// _______  _______  _______  ______
// |       ||       ||       ||      |
// |    _  ||  _____||_     _||  _    |
// |   |_| || |_____   |   |  | | |   |
// |    ___||_____  |  |   |  | |_|   |
// |   |     _____| |  |   |  |       |
// |___|    |_______|  |___|  |______|
// PSTD Clipboard manager
const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path')
const url = require('url')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;
let dev = false

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    dev = true
}

function createWindow() {
    const { screen } = require('electron');
    if (process.env === 'dev') {
        const installer = require('electron-devtools-installer');
        installer
            .default(installer['REACT_DEVELOPER_TOOLS'])
            .then(name => console.log(`Added Extension:  ${name}`))
            .catch(err => console.log('An error occurred: ', err));
    }
    const display = screen.getPrimaryDisplay();
    const area = display.workArea;

    const maxiSize = display.workAreaSize;
    // both width and height are needed to correctly position the screen
    const width = display.bounds.width;
    const height = display.bounds.height;

    mainWindow = new BrowserWindow({
        resizable: false,
        height: 350,
        width: maxiSize.width,
        frame: false,
        alwaysOnTop: true,
        x: width,
        y: height + 350,
        show: false,
        transparent: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    let indexPath

    if (dev && process.argv.indexOf('--noDevServer') === -1) {
        indexPath = url.format({
            protocol: 'http:',
            host: 'localhost:8080',
            pathname: 'index.html',
            slashes: true
        })
    } else {
        indexPath = url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', 'index.html'),
            slashes: true
        })
    }

    mainWindow.loadURL(indexPath)
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    mainWindow.hide();
    let imgPath = dev ? "./src/icons/png/96x96.png" : path.join(process.resourcesPath, "png/96x96.png");
    tray = new Tray(imgPath);
    const trayMenuTemplate = [{
        label: 'Show',
        click() {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        }
    }, {
        type: 'separator'
    }, {
        label: 'Quit',
        click() {
            app.exit(0);
        }
    }];

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
    tray.setContextMenu(trayMenu)
    // show tray when clicked on
    // tray.on('click', () => {
    //     mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    // });

    // register esc when showing and unregister when hidding, to avoid blocking other apps
    mainWindow.on('show', event => {
        globalShortcut.register('Esc', () => {
            mainWindow.hide();
        });
    });

    mainWindow.on('hide', event => {
        globalShortcut.unregister('Esc');
    });

    mainWindow.on('close', event => {
        event.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on('blur', event => {
        event.preventDefault();
        mainWindow.hide();
    });

    // We need a shortcut to activate the window
    const shortcut = globalShortcut.register('Super+Shift+V', () => {
        // use the same shortcut to show or hide depeding on the mainWindows state
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', event => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    //   app.quit()
    // }
    event.preventDefault();
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (mainWindow === null) {
    //     createWindow()
    // }
});
