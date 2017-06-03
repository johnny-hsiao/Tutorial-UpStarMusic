const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
	const query = Artist.find(buildQuery(criteria))
		// interpolated keys [sortProperty]
		.sort({ [sortProperty]: 1 })
		.skip(offset)
		.limit(limit);

	return Promise.all([query, Artist.find(buildQuery(criteria)).count()])
		.then((results) => {
			return {
				all: results[0],
				count: results[1],
				offset: offset,
				limit: limit
			};
		});

	// return Artist.find(criteria)
	// 	// interpolated keys [sortProperty]
	// 	.sort({ [sortProperty]: 1 })
	// 	.skip(offset)
	// 	.limit(limit)
	// 	.then((artists) => {
	// 		return { all: artists, count: artists.length, offset, limit };
	// 	})
};

const buildQuery = (criteria) => {
	const query = {};

	/*

	mongo
	use upstar_music
	show dos
	// name is the field to create an index of. “text” is the type of index
	db.artists.createIndex({ name: "text" })

	*/

	if (criteria.name) {
		// Has to match exact words
		query.$text = { $search: criteria.name };
	}

	if (criteria.age) {
		query.age = {
			$gte: criteria.age.min,
			$lte: criteria.age.max
		};
	}

	if (criteria.yearsActive) {
		query.yearsActive = {
			$gte: criteria.yearsActive.min,
			$lte: criteria.yearsActive.max
		};
	}

	return query;
};