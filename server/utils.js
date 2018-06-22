exports.listMissing = (data, list) => list.filter(item => !data[item]).join(', ') || null;
