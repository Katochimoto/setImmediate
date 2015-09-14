var context = require('./context');

// @see http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
module.exports = function() {
    return !(context.navigator && /Trident|Edge/.test(context.navigator.userAgent));
};
