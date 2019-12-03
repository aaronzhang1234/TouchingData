const path = require('path');

function getApplicationPath() {
    return path.dirname(path.dirname(__dirname));
}
function getDBPath() {
    let dbPath = "/data/POLITICS_OF_THE_GRID.db";
    return path.join(getApplicationPath(), dbPath);
}

module.exports = {
    getApplicationPath,
    getDBPath
}