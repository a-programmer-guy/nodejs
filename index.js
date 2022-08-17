// Bring in date module
const { format } = require('date-fns');
// import version 4 of uuid as uuid
// uuid is useful for writing log file entries
const { v4: uuid } = require('uuid')
// Format the date
console.log('The date(ddMMyyyy) is: ' + format(new Date(), 'ddMMyyyy\tHH:mm:ss'))

console.log(uuid());