export interface ICardsSet {
    name: string,
    cards: Array<ICard>
}

export interface ICard {
    word: string,
    wordsNotToUse: Array<string>
}

export interface IRoom {
    id: number,
    users: Array<{
        id: string,
        name: string,
        points: number
    }>,
    gameMaster: number,
    card?: ICard,
    set?: ICardsSet
}