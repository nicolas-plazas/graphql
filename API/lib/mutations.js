'use strict';

const connectDb = require('./db');
// Transforma un id de string en una id de mongo
const { ObjectID } = require('mongodb');
const errorHandler = require('./errorHandler');

module.exports = {
	createCourse: async (root, { input }) => {
		const defaults = {
			teacher: '',
			topic: '',
		};

		// Assign se utiliza para sobreescrir el curso sobre los defaults en caso de no estar nulos
		const newCourse = Object.assign(defaults, input);
		let db;
		let course;

		try {
			db = await connectDb();
			course = await db.collection('courses').insertOne(newCourse);
			newCourse._id = course.insertedId;
		} catch (error) {
			errorHandler(error);
		}

		return newCourse;
	},
	editCourse: async (root, { _id, input }) => {
		let db;
		let course;

		try {
			db = await connectDb();
			course = await db
				.collection('courses')
				.updateOne({ _id: ObjectID(_id) }, { $set: input });
			// Obtener el curso actualizado
			course = await db.collection('courses').findOne({ _id: ObjectID(_id) });
		} catch (error) {
			errorHandler(error);
		}

		return course;
	},
	deleteCourse: async (root, { _id }) => {
		let db;
		let info;

		try {
			db = await connectDb();
			info = await db.collection('courses').deleteOne({ _id: ObjectID(_id) });
		} catch (error) {
			errorHandler(error);
		}

		return info.deletedCount
			? `El curso identificado con la id ${_id} fue eliminado correctamente`
			: 'No exíste el curso con la id indicada';
	},
	// STUDENTS
	createPerson: async (root, { input }) => {
		let db;
		let student;

		try {
			db = await connectDb();
			student = await db.collection('students').insertOne(input);
			input._id = student.insertedId;
		} catch (error) {
			errorHandler(error);
		}

		return input;
	},
	editPerson: async (root, { _id, input }) => {
		let db;
		let student;

		try {
			db = await connectDb();
			await db
				.collection('students')
				.updateOne({ _id: ObjectID(_id) }, { $set: input });
			// Recuperar el estudiante actualizado
			student = await db.collection('students').findOne({ _id: ObjectID(_id) });
		} catch (error) {
			errorHandler(error);
		}

		return student;
	},
    deletePerson: async (root, { _id }) => {
		let db;
		let info;

		try {
			db = await connectDb();
			info = await db.collection('students').deleteOne({ _id: ObjectID(_id) });
		} catch (error) {
			errorHandler(error);
		}

		return info.deletedCount
			? `El estudiante identificado con la id ${_id} fue eliminado correctamente`
			: 'No exíste ningún estudiante con la id indicada';
	},
    addPeople: async (root, { courseID, personID }) => {
        let db;
        let person;
        let course;

        try {
            db = await connectDb();
            course = await db.collection('courses').findOne({ _id: ObjectID(courseID) });
            person = await db.collection('students').findOne({ _id: ObjectID(personID) });

            if (!course || !person) throw new Error('El curso o persona no exíste');

            await db.collection('courses').updateOne(
                { _id: ObjectID(courseID) },
                // $addToSet Busca si people es un arreglo, sino lo convierte un arreglo y le lleva el id de la persona
                { $addToSet: { people: ObjectID(personID) } }
            )
        } catch (error) {
            errorHandler(error);
        }

        return course;
    }
};
