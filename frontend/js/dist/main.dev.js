'use strict'; // Plantillas

var Handlebars = require('handlebars');

var _require = require('graphql-request'),
    request = _require.request;

var endpoint = 'http://localhost:3000/api';
var template = "\n{{#with error}}\n  There was an error: {{../error}}\n{{/with}}\n{{#each items}}\n<div class=\"item\">\n  <h2>{{__typename}}</h2>\n  <h3>{{title}}{{name}}</h3>\n  {{#with description}}\n    <p>{{../description}}</p>\n  {{/with}}\n  {{#with email}}\n    <p><a href=\"mailto:{{../email}}\">{{../email}}</a></p>\n  {{/with}}\n  {{#with phone}}\n    <p><a href=\"tel:{{../phone}}\">{{../phone}}</a></p>\n  {{/with}}\n</div>\n{{/each}}\n";
var templateData = Handlebars.compile(template);

function search() {
  var query, data, result, html;
  return regeneratorRuntime.async(function search$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          query = "\n    query generalSearch ($keyword: String!){\n      searchItems(keyword: $keyword) {\n        __typename\n          ...on Course {\n            title\n            description\n          }\n          ...on Monitor {\n            name\n            phone\n          }\n          ...on Student {\n            name\n            email\n          }\n      }\n    }\n  ";
          data = {
            keyword: document.getElementById('search').value
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(request(endpoint, query, data));

        case 5:
          result = _context.sent;
          html = templateData({
            items: result.searchItems
          });
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          html = templateData({
            error: _context.t0
          });

        case 12:
          document.getElementById('result').innerHTML = html;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
}

window.onload = function () {
  document.getElementById('btn-search').addEventListener('click', search);
};