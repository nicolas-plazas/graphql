'use strict';

const queries = require('./queries');
const mutations = require('./mutations');
const types = require('./types')

module.exports = {
	Query: queries,
	Mutation: mutations,
	// Deconstruir "types" y se la integra a courses
	...types
};
