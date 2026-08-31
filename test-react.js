const React = require('react');
const ReactDOMServer = require('react-dom/server');
const value = undefined;
const unit = 'ms';
const html = ReactDOMServer.renderToString(React.createElement('span', null, value, unit));
console.log("HTML:", html);
