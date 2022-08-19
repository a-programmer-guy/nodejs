const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises

const logEvents = require('./logEvents');
const EventEmitter = require('events');

class Emitter extends EventEmitter { };

const myEmitter = new Emitter();
// Listener for the emitter the event message and file name to the event emitter
myEmitter.on('log', (msg, fileName ) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

// Serve files wiht async function, need the file path,
// content type and response object. async functions need a try/catch block
const serveFile = async (filePath, contentType, response) => {
  try {
    // Get raw data from the file for the response
    const rawData = await fsPromises.readFile(filePath,
      !contentType.includes('image') ? 'utf8' : ''
    );
    // If the content type is application/json, parse the raw data, else leave raw data
    const data = contentType === 'application/json' ?
      JSON.parse(rawData) : rawData;
    // After reading the file, create the response header with the status code
    // and the content type
    response.writeHead(
      filePath.includes('404.html') ? 404 : 200, 
      {'Content-Type': contentType});
    // End the response with the data
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
      // Log error events containing the error name and the error message to the errLog.txt file
    myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
    response.statusCode = 500;
    response.end();
  }
}

// Create server to accept and log requests
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  // Log events containing the req.url and the req.method to the reqLog.txt file
  myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');


  // Get the extension from the request url
  const extension = path.extname(req.url);
  // Use a switch statement to detect the content type
  let contentType;
  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.png':
      contentType = 'image/png'
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
      break;
  }

  // Set the value of the file path
  let filePath =
    // If the content type is text/html and the request url is only a /
    contentType === 'text/html' && req.url === '/' ?
      // Then set the path to the full directory name to the index.html in the view filepath
      path.join(__dirname, 'views', 'index.html') :
      // if the content type is text/html but not just the /
      contentType === 'text/html' && req.url.slice(-1) === '/' ?
        // we need to specify the subdirectory with the req.url in the views filepath
        path.join(__dirname, 'views', req.url, 'index.html') :
        // If not check to see if the content typpe is text/html
        contentType === 'text/html' ?
          // and return the file requested from the views folder specified by the req.url
          path.join(__dirname, 'views', req.url) :
          // However, if thats not the case, return whatever file requested from the req.url
          path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

  const fileExists =  fs.existsSync(filePath);

  if(fileExists){
    // File exists? Send it with the filepath, content type and
    // response object as defined in the server, not the serveFile function
    serveFile(filePath, contentType, res);
  } else {
    let redirectFile = path.parse(filePath).base;
    switch(redirectFile){
      case 'old-page.html':
        // Redirect from old page to new page - status 301 for redirect
        res.writeHead(301, {'Location' : '/new-page.html'});
        res.end();
        break;
      case 'www-page.html':
        // Redirect back to homepage
        res.writeHead(301, {'Location' : '/'});
        res.end();
        break;
      default:
        // Serve response of 404 page from the views folder. content type is text/html
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});


