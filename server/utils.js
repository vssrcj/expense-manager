/**
 * Extracts all the keys from 'data' that corresponds to 'list' that are empty.
 *
 * @param {object} data
 * @param {list} list
 * @returns
 */
exports.listMissing = function (data, list) {
   return list.filter(item => !data[item]).join(', ') || null;
};
