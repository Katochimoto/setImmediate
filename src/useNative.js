import context from './context';

// @see http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
export default (function () {
  return !(context.navigator && /Trident|Edge/.test(context.navigator.userAgent));
})();
