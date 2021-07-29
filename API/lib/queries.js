'use strict';

const connectDB = require('./db')
// Transforma un id de string en una id de mongo
const { ObjectID } = require('mongodb');
const errorHandler = require('./errorHandler');

module.exports = {
	getCourses: async () => {
		let db;
		let courses = [];
		try {
			db = await connectDB();
			// Hace la consulta y la convierte en un arreglo mediante el toArray
			courses = await db.collection('courses').find().toArray();
		} catch (error) {
			errorHandler(error);
		}

		return courses;
	},
	getCourse: async (root, { id }) => {
		let db;
		let course;

		try {
			db = await connectDB();
			// review = await db.collection('listingsAndReviews').find((review) => review._id === args.id);
			course = await db.collection('courses').findOne({ _id: ObjectID(id) });
		} catch (error) {
			errorHandler(error);
		}

		return course;
	},
    // STUDENTS
    getPeople: async () => {
		let db;
		let students = [];
		try {
			db = await connectDB();
			// Hace la consulta y la convierte en un arreglo mediante el toArray
			students = await db.collection('students').find().toArray();
		} catch (error) {
			errorHandler(error);
		}

		return students;
	},
	getPerson: async (root, { id }) => {
		let db;
		let student;

		try {
			db = await connectDB();
			// review = await db.collection('listingsAndReviews').find((review) => review._id === args.id);
			student = await db.collection('students').findOne({ _id: ObjectID(id) });
		} catch (error) {
			errorHandler(error);
		}

		return student;
	},
	// Búsqueda global en todo el esquema
	searchItems: async (root, { keyword }) => {
		let db;
		let items;
		let courses;
		let people;

		try {
			db = await connectDB();
			courses = await db.collection('courses').find(
				{ $text: { $search: keyword } }
			).toArray();
			people = await db.collection('students').find(
				{ $text: { $search: keyword } }
			).toArray();
			items = [...courses, ...people];
			// review = await db.collection('listingsAndReviews').find((review) => review._id === args.id);
		} catch (error) {
			errorHandler(error);
		}

		return items;
	},
};
