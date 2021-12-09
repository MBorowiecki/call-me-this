import React from "react";
import io, { Socket } from "socket.io-client";
import { serverIp } from "../config/server";

export const socket = io(serverIp);

export const SocketContext = React.createContext<Socket | null>(null)