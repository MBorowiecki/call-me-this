import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const localize = () => {
    i18n.translations = {
        en: {
            'JUMP IN!': 'JUMP IN!',
            'Or': 'Or',
            'CREATE GAME': 'CREATE GAME',
            'Your name': 'Your name',
            'Game ID': 'Game ID',
            'Room ID': 'Room ID',
            'Players': 'Players',
            'START GAME!': 'START GAME!',
            'Score': 'Score',
            'GUESS!': 'GUESS!',
            'Guess the word...': 'Guess the word...',
        },
        pl: {
            'JUMP IN!': 'DOŁĄCZ!',
            'Or': 'Lub',
            'CREATE GAME': 'STWÓRZ GRĘ',
            'Your name': 'Imię',
            'Game ID': 'ID Gry',
            'Room ID': 'ID Pokoju',
            'Players': 'Gracze',
            'START GAME!': 'WŁĄCZ GRĘ!',
            'Score': 'Wynik',
            'GUESS!': 'ZGADNIJ!',
            'Guess the word...': 'Zgadnij słowo...',
        },
    };
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;
}

export default localize;