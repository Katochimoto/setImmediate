import context from '../context';
import * as Timer from '../timer';

export function init() {
  const html = context.document.documentElement;

  const polifill = function () {
    const handleId = Timer.create(arguments);
    let script = context.document.createElement('script');

    script.onreadystatechange = function () {
      Timer.run(handleId);
      script.onreadystatechange = null;
      html.removeChild(script);
      script = null;
    };

    html.appendChild(script);
    return handleId;
  };

  polifill.usePolifill = 'readyStateChange';

  return polifill;
};

// For IE 6–8
export function canUse() {
  return (context.document && ('onreadystatechange' in context.document.createElement('script')));
};
