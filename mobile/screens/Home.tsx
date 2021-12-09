import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';

import { ButtonPrimary, ButtonSecondary } from '../components/buttons';
import { SocketContext } from '../contexts/socket';
import { CardViewPrimary } from '../components/cards';
import { TextInputPrimary } from '../components/inputs';
import { BreakView, MainView } from '../components/views';

const connectToRoom: (userName: string, gameId: string, socket: Socket) => void = (userName, gameId, socket) => {
    socket.emit('rooms:join', { id: gameId, userName });
}

const createRoom: (userName: string, socket: Socket) => void = (userName, socket) => {
    socket.emit('rooms:create', { userName });
}

const Home: React.FC = () => {
    const [gameId, setGameId] = useState("");
    const [userName, setUserName] = useState("");
    const socket = React.useContext(SocketContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (socket) {
            socket.on('rooms:failedJoining', () => {
                console.log('Failed joining room');
            })

            socket.on('rooms:joined', data => {
                AsyncStorage.setItem("roomMeta", JSON.stringify(data.room));

                navigation.navigate('Room');
            })
        }
    }, [socket])

    return (
        <MainView>
            <StatusBar style="light" />

            <CardViewPrimary>
                <TextInputPrimary
                    placeholder="Your name"
                    keyboardType="default"
                    onTextChanged={(text) => setUserName(text)}
                />
                <BreakView margin="xl" />
                <TextInputPrimary
                    placeholder="Game ID"
                    keyboardType="numeric"
                    onTextChanged={(text) => setGameId(text)}
                />
                <BreakView margin="xl" />
                <ButtonPrimary
                    onPress={() => socket && userName.length > 0 && gameId.length > 0 && connectToRoom(userName, gameId, socket)}
                >
                    <Text
                        style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}
                    >JUMP IN!</Text>
                </ButtonPrimary>
                <BreakView margin="xl" />
                <View
                    style={{ alignItems: "center" }}
                >
                    <Text
                        style={{ fontSize: 14, fontWeight: "400", color: "#202020", alignItems: "center" }}
                    >Or</Text>
                </View>
                <BreakView margin="m" />
                <ButtonSecondary
                    onPress={() => socket && userName.length > 0 && createRoom(userName, socket)}
                >
                    <Text
                        style={{ fontSize: 14, fontWeight: "700", color: "#202020" }}
                    >CREATE GAME</Text>
                </ButtonSecondary>
            </CardViewPrimary>
        </MainView>
    )
}

export default Home