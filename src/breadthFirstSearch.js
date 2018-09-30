const coordinates = require('./config.js');

let blocks = [];
let matrix = [];

// Declare start
const start = coordinates.startCoordinate;
// Declare end
const end = coordinates.endCoordinate;

// Random indexes for blocks
const makeBlocks = () => {
	for (let i = 0; i < 40; i += 1) {
		let arr = [];
		for (let j = 0; j < 2; j += 1) {
			arr.push(Math.floor(Math.random() * 10));
			if (JSON.stringify(arr) === JSON.stringify(start) || JSON.stringify(arr) === JSON.stringify(end)) {
				arr = [];
				j = -1;
			}
		}
		blocks.push(arr);
	}
};

// Make matrix full of zeros
const makeEmptyMatrix = () => {
	for (let i = 0; i < 10; i += 1) {
		const arr = [];
		for (let j = 0; j < 10; j += 1) {
			arr.push(0);
		}
		matrix.push(arr);
	}
};

// Make complete matrix with blocks
const makeCompleteMatrix = () => {
	for (let i = 0; i < blocks.length; i += 1) {
		matrix[[blocks[i][0]]][[blocks[i][1]]] = 1;
	}
};

// Create new matrix for beginning of algorithm and if there is no path
const createNewMatrix = () => {
	blocks = [];
	matrix = [];
	makeBlocks();
	makeEmptyMatrix();
	makeCompleteMatrix();
	matrix[start[0]][start[1]] = 'start';
	matrix[end[0]][end[1]] = 'end';
	return matrix;
};

createNewMatrix();

console.log(matrix);

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not 0,
// and has not yet been visited by our algorithm)
// Returns "valid", "invalid", "blocked", or "goal"
const locationStatus = (location, grid) => {
	const gridSize = grid.length;
	const dft = location.distanceFromTop;
	const dfl = location.distanceFromLeft;

	if (location.distanceFromLeft < 0
		|| location.distanceFromLeft >= gridSize
		|| location.distanceFromTop < 0
		|| location.distanceFromTop >= gridSize) {
		return 'invalid';
	}
	if (grid[dft][dfl] === 'end') {
		return 'end';
	}
	if (grid[dft][dfl] !== 0) {
		return 'blocked';
	}
	return 'valid';
};

// Explores the grid from the given location in the given direction
const exploreInDirection = (currentLocation, direction, grid) => {
	const newPath = currentLocation.path.slice();

	let dft = currentLocation.distanceFromTop;
	let dfl = currentLocation.distanceFromLeft;

	newPath.push([dft, dfl]);

	if (direction === 'north') {
		dft -= 1;
	} else if (direction === 'east') {
		dfl += 1;
	} else if (direction === 'south') {
		dft += 1;
	} else if (direction === 'west') {
		dfl -= 1;
	}

	const newLocation = {
		distanceFromTop: dft,
		distanceFromLeft: dfl,
		path: newPath,
		status: 'unknown',
	};
	newLocation.status = locationStatus(newLocation, grid);

	// If this new location is valid, mark it as 'visited'
	if (newLocation.status === 'valid') {
		grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'visited';
	}

	return newLocation;
};

// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
const findShortestPath = (startCoordinates, grid) => {
	const distanceFromTop = startCoordinates[0];
	const distanceFromLeft = startCoordinates[1];

	// Each "location" will store its coordinates
	// and the shortest path required to arrive there
	const location = {
		distanceFromTop,
		distanceFromLeft,
		path: [],
		status: 'start',
	};

	// Initialize the queue with the start location already inside
	const queue = [location];

	// Loop through the grid searching for the goal
	while (queue.length > 0) {
		// Take the first location off the queue
		const currentLocation = queue.shift();

		// Explore North
		let newLocation = exploreInDirection(currentLocation, 'north', grid);
		if (newLocation.status === 'end') {
			return newLocation.path.push();
		}
		if (newLocation.status === 'valid') {
			queue.push(newLocation);
		}

		// Explore East
		newLocation = exploreInDirection(currentLocation, 'east', grid);
		if (newLocation.status === 'end') {
			return newLocation.path;
		}
		if (newLocation.status === 'valid') {
			queue.push(newLocation);
		}

		// Explore South
		newLocation = exploreInDirection(currentLocation, 'south', grid);
		if (newLocation.status === 'end') {
			return newLocation.path;
		}
		if (newLocation.status === 'valid') {
			queue.push(newLocation);
		}

		// Explore West
		newLocation = exploreInDirection(currentLocation, 'west', grid);
		if (newLocation.status === 'end') {
			return newLocation.path;
		}
		if (newLocation.status === 'valid') {
			queue.push(newLocation);
		}
	}
	// Make new matrix if path is blocked
	createNewMatrix();
	return findShortestPath(start, matrix);
};

// console.log(findShortestPath(start, matrix));
module.exports = {
	findShortestPath,
	matrix,
};
