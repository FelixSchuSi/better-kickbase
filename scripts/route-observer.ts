const callbacks = [];

// (function(history) {
//   var pushState = history.pushState;
//   history.pushState = function(state) {
//     if (typeof history.onpushstate == "function") {
//       history.onpushstate({ state: state });
//     }
//     console.log("state: ", state);
//     console.log("location: ", window.location);
//     // ... whatever else you want to do
//     // maybe call onhashchange e.handler
//     return pushState.apply(history, arguments);
//   };
// })(window.history);

// #########

// function logOnHistoryStateUpdated(details) {
//   console.log(`onHistoryStateUpdated: ${details.url}`);
//   console.log(`Transition type: ${details.transitionType}`);
//   console.log(`Transition qualifiers: ${details.transitionQualifiers}`);
// }

// browser.webNavigation.onHistoryStateUpdated.addListener(
//   logOnHistoryStateUpdated
// );

// #########

// var _wr = function(type) {
//     var orig = history[type];
//     return function() {
//         debugger;
//         var rv = orig.apply(this, arguments);
//         var e = new Event(type);
//         e.arguments = arguments;
//         window.dispatchEvent(e);
//         return rv;
//     };
// };
// history.pushState = _wr('pushState');
// history.replaceState = _wr('replaceState');
// history.back = _wr('back');
// history.onpushstate = _wr('onpushstate');

// window.addEventListener('pushState', function(e) {
//     debugger;
//     console.warn('THEY DID IT AGAIN!');
// });

console.log("observer loaded");
