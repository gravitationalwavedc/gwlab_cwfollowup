export function cleanData(data) {
    return data.filter(
        value => {
            if (value.length) {
                return value;
            }
        }
    );
}

// Partially borrowed from https://www.programiz.com/javascript/examples/float-or-integer
const checkNumber = (x) => (typeof x == 'number' && !isNaN(x)) || x === null;

export function checkData(data) {
    for (var i = 0; i < data.length; i++) {
        var row = i+1;
        var candidate = data[i];

        if (candidate.length && candidate.length < 6) {
            return `Row ${row} doesn't have enough columns`;
        } else if (!checkNumber(candidate[0])){
            return `Row ${row}, column 1 must be a number`;
        } else if (!['o1', 'o2', 'o3', 'o4'].includes(candidate[1])){
            return `Row ${row}, column 2 must be in the range O1-4`;
        } else if (!(typeof candidate[2] == 'boolean')) {
            return `Row ${row}, column 3 must be a boolean`;
        } else if (!checkNumber(candidate[3])){
            return `Row ${row}, column 4 must be a number`;
        } else if (!checkNumber(candidate[4])){
            return `Row ${row}, column 5 must be a number`;
        } else if (!checkNumber(candidate[5])){
            return `Row ${row}, column 6 must be a number`;
        }
    }
    return null;
}