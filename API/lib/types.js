'use strict';

const connectDb = require('./db');
// Transforma un id de string en una id de mongo
const { ObjectID } = require('mongodb');
const errorHandler = require('./errorHandler');

module.exports = {
	Course: {
		people: async ({ people }) => {
			let db;
			let peopleData;
			let ids;

			try {
                // Conectarse a la base de datos
				db = await connectDb();
                /*
                    Validar si hay "people.
                    true: realiza un map con la id
                    false: retorna un arreglo vacío
                */
				ids = people ? people.map((id) => ObjectID(id)) : [];
                /*
                    Válidar que las ids tengan una longitud mayor a 0
                    true: realiza la consulta
                    false: retorna un arreglo vacío
                */
				peopleData =
					ids.length > 0
						? await db
								.collection('students')
								.find({ _id: { $in: ids } })
								.toArray()
						: [];
			} catch (error) {
				errorHandler(error);
			}

            return peopleData;
		},
	},
	Person: {
		// ResolveType se utliza para sabe que tipo de "person" es estudiante o monitor
		__resolveType: (person, context, info) => {
			if (person.phone) {
				return 'Monitor';
			}

			return 'Student';
		}
	},
	GlobalSearch: {
		__resolveType: (item, context, info) => {
			if (item.title) {
				return 'Course';
			}

			if (item.phone) {
				return 'Monitor';
			}

			return 'Student';
		}
	}
};
