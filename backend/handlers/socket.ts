import { Server, Socket } from 'socket.io';
import http from 'http'

import { ICardsSet, IRoom } from '../types';
import cardSets from '../data/cardSets';

let io: Server;
const rooms: Array<IRoom> = [];

const initialize = (server: http.Server) => {
    io = new Server(server);

    io.on('connection', socket => {
        console.log(`[[ INFO ]] ${new Date(Date.now()).toUTCString()} - Player ${socket.id} connected.`)

        bindEvents(socket);
    })
}

const bindEvents = (socket: Socket) => {
    socket.on('rooms:join', data => {
        if (data.id) {
            const { id, userName } = data;
            console.log(`[[ INFO ]] ${new Date(Date.now()).toUTCString()} - Player ${socket.id} joining room ${id}.`);

            joinRoom(socket, id, userName);
        }
    })

    socket.on('rooms:create', data => {
        if (data) {
            const { userName } = data;
            console.log(`[[ INFO ]] ${new Date(Date.now()).toUTCString()} - Player ${socket.id} creating room.`);

            createRoom(socket, userName)
        }
    })

    socket.on('rooms:start', data => {
        if (data) {
            const { id } = data;
            console.log(`[[ INFO ]] ${new Date(Date.now()).toUTCString()} - Player ${socket.id} starting room ${id}.`);

            startGame(socket, id)
        }
    })

    socket.on('rooms:leave', data => {
        if (data) {
            const { id } = data;
            console.log(`[[ INFO ]] ${new Date(Date.now()).toUTCString()} - Player ${socket.id} leaving room ${id}.`);

            leaveRoom(socket, id);
        }
    })

    socket.on('rooms:guess', data => {
        if (data) {
            const { id, word } = data;
            console.log(`[[ INFO ]] ${new Date(Date.now()).toUTCString()} - Player ${socket.id} guessing word.`);

            guessWordInRoom(socket, id, word);
        }
    })
}

const joinRoom = (socket: Socket, id: string, userName: string) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];

    if (room) {
        room.users.push({
            id: socket.id,
            name: userName,
            points: 0
        })
        socket.join(room.id.toString());
        socket.emit('rooms:joined', { room });

        if (room) {
            io.sockets.in(room.id.toString()).emit('rooms:meta', { room })
        }
    } else {
        socket.emit('rooms:failedJoining')
    }
}

const createRoom = (socket: Socket, userName: string) => {
    const newRoomId = getNewRoomId();

    if (newRoomId) {
        const newRoom = {
            id: newRoomId,
            users: [
                {
                    id: socket.id,
                    name: userName,
                    points: 0
                }
            ],
            gameMaster: 0
        }

        rooms.push(newRoom)

        socket.join(newRoomId.toString());
        socket.emit('rooms:joined', { room: newRoom });

        if (newRoom) {
            io.sockets.in(newRoom.id.toString()).emit('rooms:meta', { room: newRoom })
        }
    }
}

const startGame = (socket: Socket, id: string) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];
    const random = Math.floor(Math.random() * cardSets.en.length);
    const set = cardSets.en[random]

    if (set && room) {
        room.set = set;

        drawCard(socket, id, set);
        io.sockets.in(room.id.toString()).emit('rooms:start', { set });
    }
}

const leaveRoom = (socket: Socket, id: string) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];

    if (room) {
        socket.leave(room.id.toString());
        room.users.splice(room.users.findIndex((user) => user.id !== socket.id), 1);

        if (room.users.length <= 0) {
            rooms.splice(rooms.findIndex((_room) => _room.id === room.id), 1);
        } else {
            io.sockets.in(room.id.toString()).emit('rooms:meta', { room })
        }
    }
}

const guessWordInRoom = (socket: Socket, id: string, word: string) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];

    if (room.card) {
        if (room.card.word === word) {
            const playerIndex = room.users.findIndex(player => player.id === socket.id);
            room.users[playerIndex].points++;
            socket.emit('rooms:guess', { isGuessed: true });
            handleNextTurn(socket, id);
        } else {
            socket.emit('rooms:guess', { isGuessed: false });
        }
    }
}

const handleNextTurn = (socket: Socket, id: string) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];

    if (room.set) {
        changeRoomGameMaster(id);
        drawCard(socket, id, room.set)
        io.sockets.in(room.id.toString()).emit('rooms:meta', { room })
    }
}

const changeRoomGameMaster = (id: string) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];

    if (room) {
        if (room.gameMaster + 1 >= room.users.length) {
            room.gameMaster = 0;
        } else {
            room.gameMaster++;
        }
    }
}

const drawCard = (socket: Socket, id: string, set: ICardsSet) => {
    const roomIndex = rooms.findIndex(_room => _room.id === parseInt(id));
    const room = rooms[roomIndex];
    const card = set.cards[Math.floor(Math.random() * set.cards.length)];

    room.card = card;
    room && set && io.sockets.sockets.get(room.users[room.gameMaster].id)?.emit("rooms:drawCard", { card });
}

const getNewRoomId: () => number = () => {
    const newRoomId = Math.round((Math.random() * (10000 - 1000)) + 1000);

    const room = rooms.filter(_room => _room.id === newRoomId)[0];

    if (!room) {
        return newRoomId;
    } else {
        return getNewRoomId();
    }
}

export default initialize;