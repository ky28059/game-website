'use client'

import type {GameInfo} from './page';

// Components
import Game, {PlayerSide, UpdateGameStatesCallbacks} from './Game';
import TicTacToeBoard, {defaultTTTBoard, PlayerSymbol, TTTBoard} from './TicTacToeBoard';


export default function TicTacToeGame(props: {id: string, username?: string, info: GameInfo}) {
    function updateGameStatesFromMoves(moves: string[], {setGameStates, setGameStateIndex}: UpdateGameStatesCallbacks<TTTBoard>) {
        setGameStates((gameStates) => {
            const arr = gameStates.slice();
            let symbol: PlayerSymbol = arr.length % 2 === 0 ? PlayerSymbol.SECOND : PlayerSymbol.FIRST;

            for (let i = 0; i < moves.length; i++) {
                const [, col, row] = moves[i].match(/(\w)(\d)/)!;
                const state = arr.at(-1)!.slice() as TTTBoard;

                state[rowToIndex(row) + colToIndex(col)] = symbol;
                arr.push(state);

                symbol = alternatePlayerSymbol(symbol);
            }

            // If the player is viewing the last move, keep them on the last move when new moves are added
            setGameStateIndex((gameStateIndex) => gameStateIndex === gameStates.length - 1 ? arr.length - 1 : gameStateIndex);

            console.log(arr);
            return arr;
        });
    }

    // Makes a move by checking the given square.
    async function setSquare(square: number) {
        const col = square % 3;
        const row = (square - col) / 3

        await fetch(`${process.env.API_BASE}/game/${props.id}/move/${indexToCol(col)}${row + 1}`, {
            method: 'POST',
            credentials: 'include'
        });
    }

    return (
        <Game {...props} defaultBoard={defaultTTTBoard} updateGameStatesFromMoves={updateGameStatesFromMoves}>
            {(gameStates, gameStateIndex, gameStatus, side) => (
                <TicTacToeBoard
                    boardState={gameStates[gameStateIndex]}
                    playerSymbol={getPlayerSymbolFromSide(side)}
                    setSquare={setSquare}
                    disabled={gameStatus !== 'STARTED' || gameStateIndex !== gameStates.length - 1 || side === 'SPECTATOR'}
                    over={gameStatus !== 'STARTED' && gameStateIndex === gameStates.length - 1}
                />
            )}
        </Game>
    )
}

export function getPlayerSymbolFromSide(side: PlayerSide) {
    switch (side) {
        case 'FIRST': return PlayerSymbol.FIRST;
        case 'SECOND': return PlayerSymbol.SECOND;
        default: return PlayerSymbol.EMPTY;
    }
}

export function alternatePlayerSymbol(symbol: PlayerSymbol) {
    return symbol === PlayerSymbol.FIRST ? PlayerSymbol.SECOND : PlayerSymbol.FIRST;
}

export function toDisplayTTTSymbol(symbol: PlayerSymbol) {
    switch (symbol) {
        case PlayerSymbol.FIRST: return '✕';
        case PlayerSymbol.SECOND: return '◯';
        default: return '';
    }
}

export function rowToIndex(row: string) {
    return (Number(row) - 1) * 3;
}

export function colToIndex(col: string) {
    return col.charCodeAt(0) - 97;
}

export function indexToCol(index: number) {
    return String.fromCodePoint(index + 97);
}
