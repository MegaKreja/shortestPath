const breadthFirstSearch = require('./breadthFirstSearch.js');
const coordinates = require('./config.js');

const { startCoordinate } = coordinates;
const { matrix } = breadthFirstSearch;


console.log(breadthFirstSearch.findShortestPath(startCoordinate, matrix));
