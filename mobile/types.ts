export type RootStackParamList = {
    Home: undefined;
    Room: undefined
};

export interface IRoomUser {
    id: string,
    name: string,
    points: number
}

export interface IRoomMetaData {
    id: number,
    users: Array<IRoomUser>,
    gameMaster: number
}

export interface ICard {
    word: string,
    wordsNotToUse: Array<string>
}

export interface ICardSet {
    name: string,
    cards: Array<ICard>
}