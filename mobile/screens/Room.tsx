import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket } from 'socket.io-client';

import { ButtonPrimary } from '../components/buttons';
import { CardTitle, CardViewPrimary } from '../components/cards';
import { TextInputPrimary } from '../components/inputs';
import { BreakView, MainView } from '../components/views';
import { SocketContext } from '../contexts/socket';
import { ICard, IRoomMetaData, IRoomUser } from '../types';

const getCurrentUser: (meta: IRoomMetaData, socket: Socket) => IRoomUser = (meta, socket) => {
    const currentUserId = meta.users.findIndex(_user => _user.id === socket.id);
    return meta.users[currentUserId];
}

const startGame: (socket: Socket, id: string) => void = (socket, id) => {
    socket.emit('rooms:start', { id });
}

const guessWord: (socket: Socket, word: string, id: string) => void = (socket, word, id) => {
    socket.emit('rooms:guess', { id, word });
}

const Home: React.FC = () => {
    const [meta, setMeta] = useState<IRoomMetaData | null>(null);
    const [currentUser, setCurrentUser] = useState<IRoomUser | null>(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [currentCard, setCurrentCard] = useState<ICard | null>(null);
    const [wordGuessed, setWordGuessed] = useState("");
    const socket = React.useContext(SocketContext);

    const getRoomMeta = async () => {
        const roomMeta = await AsyncStorage.getItem("roomMeta");

        roomMeta && setMeta(JSON.parse(roomMeta));
    }

    useEffect(() => {
        if (socket instanceof Socket) {
            socket.on('rooms:meta', (data) => {
                if (data) {
                    AsyncStorage.removeItem("roomMeta");
                    AsyncStorage.setItem("roomMeta", data.room);
                    setMeta(data.room);
                }
            })

            socket.on('rooms:start', () => {
                setIsGameStarted(true);
            })

            socket.on('rooms:drawCard', (data) => {
                setCurrentCard(data.card)
            })
        }
    }, [socket])

    useEffect(() => {
        if (meta) {
            if (meta && socket) {
                const userIndex = meta.users.findIndex(_user => _user.id === socket.id);
                setIsGameMaster(userIndex === meta.gameMaster);
            }
        }
    }, [meta, currentUser])

    useEffect(() => {
        socket && meta && !currentUser && setCurrentUser(getCurrentUser(meta, socket));
    }, [meta])

    useEffect(() => {
        getRoomMeta();

        return () => {
            socket?.off("rooms:meta");
            socket?.off("rooms:start");
            socket?.off("rooms:drawCard");
            socket?.emit('rooms:leave')
        }
    }, [])

    return (
        <MainView>
            <StatusBar style="light" />

            <View style={{ marginTop: 40 }}>
                <Text style={{ textAlign: "center", fontSize: 14, color: "#f0f0f0" }}>Room ID: {meta?.id}</Text>
            </View>
            <BreakView margin="m" />

            <ScrollView
                style={{
                    height: "40%"
                }}
                contentContainerStyle={{
                    alignItems: "center"
                }}
            >
                <Text style={{ fontSize: 36, color: "#f0f0f0", fontWeight: "700" }}>Players:</Text>
                <BreakView margin="m" />
                {meta && meta.users.map(user => {
                    return (
                        <Text
                            style={{
                                fontSize: 18,
                                marginBottom: 8,
                                color: "#f0f0f0"
                            }}
                        >
                            {user.name} | Score: {user.points}
                        </Text>
                    )
                })}
            </ScrollView>

            <View style={{ height: "60%", justifyContent: "center" }}>
                {meta && currentUser && isGameMaster && !isGameStarted &&
                    <ButtonPrimary
                        onPress={() => socket && startGame(socket, meta.id.toString())}
                    >
                        <Text style={{ fontSize: 24, color: "#f0f0f0", fontWeight: "700" }}>START GAME!</Text>
                    </ButtonPrimary>
                }
                {isGameMaster && currentCard && isGameStarted &&
                    <CardViewPrimary>
                        <CardTitle>
                            {currentCard.word}
                        </CardTitle>

                        <View>
                            {currentCard.wordsNotToUse.map(wordNotToUse => {
                                return <Text style={{ fontSize: 16, color: "#383838", marginBottom: 8, textAlign: "center" }}>{wordNotToUse}</Text>
                            })}
                        </View>
                    </CardViewPrimary>
                }
                {!isGameMaster && isGameStarted &&
                    <CardViewPrimary>
                        <TextInputPrimary
                            placeholder="Guess the word..."
                            keyboardType="default"
                            onTextChanged={(text) => setWordGuessed(text)}
                        />
                        <BreakView margin="xl" />
                        <ButtonPrimary
                            onPress={() => meta && socket && guessWord(socket, wordGuessed, meta.id.toString())}
                        >
                            <Text style={{ fontSize: 16, color: "#f0f0f0", fontWeight: "700" }}>GUESS!</Text>
                        </ButtonPrimary>
                    </CardViewPrimary>
                }
            </View>
        </MainView>
    )
}

export default Home