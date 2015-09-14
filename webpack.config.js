var path = require('path');

module.exports = {
    'context': path.join(__dirname, 'src'),
    'output': {
        'path': path.join(__dirname, 'dist'),
        'libraryTarget': 'umd'
    }
};
