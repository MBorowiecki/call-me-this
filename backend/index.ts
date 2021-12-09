import express from 'express';
import http from 'http';

import socket from './handlers/socket';

const app = express();
const server = http.createServer(app);

socket(server);

server.listen(process.env.PORT || 3000, () => {
    console.log('The application is listening on port 3000!');
})