// Bring in date module
const { format } = require('date-fns');
// Import version 4 of uuid as uuid (v4: uuid)
// uuid is useful for writing log file entries
const { v4: uuid } = require('uuid')
// import filesystem module
const fs = require('fs');
// import file system async promises
const fsPromises = require('fs').promises;
// import path module
const path = require('path');

// Create a log event and store it in a folder names logs
// Can add a parameter to the logEvents object along with message.
const logEvents = async (message) => {
  const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if(!fs.existsSync(path.join(__dirname, 'logs'))) {
    // If the directory doesn't exist, create it
      await fsPromises.mkdir(path.join(__dirname, 'logs'));
    }

    // Append logItem in the eventlog.txt file in the logs folder in this directory
    await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem);
  } catch (err){
    console.log(err);
  }
}
// Export to make the logEvents object usable elsewhere
module.exports = logEvents;
