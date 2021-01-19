const remote = require('electron').remote;
const app = remote.app;
const Datastore = require('nedb-promises');

const dbFactory = Datastore.create({
    filename: `${process.env.NODE_ENV === 'development' ? 'dev.db' : app.getAppPath('userData')}/data/pstd.db`,
    timestampData: true,
    autoload: true
});

const db = {
    clips: dbFactory,
};

module.exports = db;