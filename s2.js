//Module Load
const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const WebSocket = require("./websocket");
WebSocket.Server = require("./websocket-server");

//Server configuration
const hostname = 'localhost';
const port = 3000;

//Send file to client
function sendFile(res,filePath,contentType){
	fs.readFile(filePath, function(error,content){
		if (error){
			res.writeHead(500);
			res.end("Error code: "+error.code+"\n");
			res.end()
		}
		else {
			res.writeHead(200, {'Content-Type': contentType});
			res.end(content)
		}
	})
}

//Config http server
const server = http.createServer((req,res) => {

	//Printout HTTP request detail (for debug reasons)
	var url = req.url;
	var http_method = req.method;
	console.log("URL :" + url );
	console.log("Method : " + http_method)
	console.log(req.headers);
	console.log("\n");

	
	//Handle Login Input
	if ((http_method == 'POST')&&(url=='/l')) {
		var body = '';
		req.on('data', function(data){
			body+=data;
			if (body.length > 1e6)
				req.connection.destroy();
		});
		req.on('end', function(){
			var post = qs.parse(body);
			console.log(post)
		})
	}

	//Send favicon
	if (url == '/favicon.ico'){
		sendFile(res,"./logo.png","image/apng");
	}
	//Send index page
	else {
		sendFile(res,"./login.html","text/html");
	}

})

// Start server
server.listen(port,hostname, () => {
	console.log('Server running at http://'+hostname+':'+port);
})


const wss = new WebSocket.Server({port:3001});

wss.on('connection', ws => {
	ws.on('message', message => {
		console.log(message)
	})
	ws.send('yo!')
	var stdin = process.stdin;
stdin.setEncoding('utf-8');
stdin.on('data', function(data){
	ws.send(data)
})
})


