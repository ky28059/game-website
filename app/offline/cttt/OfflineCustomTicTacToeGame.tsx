'use client'

import {useState} from 'react';

// Components
import TicTacToeBoard, {BoardStatus, checkBoardStatus, defaultTTTBoard, PlayerSymbol} from '../../game/[id]/TicTacToeBoard';
import OfflineScoreIndicator, {Scores} from '../ttt/OfflineScoreIndicator';
import OfflineMoveIndicator from '../OfflineMoveIndicator';
import SecondarySlider from '../../../components/SecondarySlider';
import ScaledBox from '../../../components/ScaledBox';

// Util
import {alternatePlayerSymbol} from '../../game/[id]/TicTacToeGame';


export default function OfflineCustomTicTacToeGame() {
    const [gameState, setGameState] = useState<PlayerSymbol[]>(defaultTTTBoard);
    const [gameStatus, setGameStatus] = useState(BoardStatus.PLAYING);

    const [scores, setScores] = useState<Scores>([0, 0]);

    const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>(PlayerSymbol.FIRST);
    const [nextStartSymbol, setNextStartSymbol] = useState<PlayerSymbol>(PlayerSymbol.SECOND);

    const [rows, setRows] = useState(3);
    const [columns, setColumns] = useState(3);
    const [needed, setNeeded] = useState(3);

    // Updates the number of rows in the board, resetting the board and constraining `needed` to below
    // the new max dimension.
    function updateRows(rows: number) {
        setRows(rows);
        setNeeded(Math.min(needed, Math.max(rows, columns)));
        setGameState(Array(rows * columns).fill(PlayerSymbol.EMPTY))
    }

    // Updates the number of columns in the board, resetting the board and constraining `needed` to below
    // the new max dimension.
    function updateColumns(columns: number) {
        setColumns(columns);
        setNeeded(Math.min(needed, Math.max(rows, columns)));
        setGameState(Array(rows * columns).fill(PlayerSymbol.EMPTY))
    }

    // Makes a move by checking the given square, alternating the player's symbol after each move.
    function setSquare(square: number, symbol: PlayerSymbol) {
        const newGameState = [...gameState]
        newGameState[square] = symbol;

        setGameState(newGameState);
        setPlayerSymbol(alternatePlayerSymbol(playerSymbol));

        // Check board status and handle accordingly
        const status = checkBoardStatus(square, newGameState, rows, columns, needed);
        setGameStatus(status);

        // Wins are +1 for the winner, ties are +0.5 for both players
        switch (status) {
            case BoardStatus.TIED: setScores([scores[0] + 0.5, scores[1] + 0.5]); break;
            case BoardStatus.FIRST_VICTORY: setScores([scores[0] + 1, scores[1]]); break;
            case BoardStatus.SECOND_VICTORY: setScores([scores[0], scores[1] + 1]); break;
        }
    }

    // Starts a new game, resetting the board, status, and symbol, alternating start symbols;
    // if X started the last game, O starts the next game.
    function resetBoard() {
        setGameState(defaultTTTBoard);
        setGameStatus(BoardStatus.PLAYING);
        setPlayerSymbol(nextStartSymbol);
        setNextStartSymbol(alternatePlayerSymbol(nextStartSymbol));
    }

    return (
        <main className="flex-grow flex flex-col gap-4 items-center justify-center px-4 min-h-0 pb-8 sm:pb-12 md:pb-16">
            <OfflineScoreIndicator scores={scores} />

            <ScaledBox className="w-full" rescale={[rows, columns]}>
                <TicTacToeBoard
                    boardState={gameState}
                    playerSymbol={playerSymbol}
                    setSquare={setSquare}
                    disabled={gameStatus !== BoardStatus.PLAYING}
                    over={gameStatus !== BoardStatus.PLAYING}
                    rows={rows}
                    columns={columns}
                />
            </ScaledBox>

            <section className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <div className="w-56">
                    <p className="mb-1.5 text-sm">Rows: <strong>{rows}</strong></p>
                    <SecondarySlider
                        value={rows}
                        onChange={updateRows}
                        min={2}
                        max={10}
                        className="h-5 slider-thumb:w-8 slider-thumb:h-5 transition duration-200"
                    />
                </div>

                <div className="w-56">
                    <p className="mb-1.5 text-sm">Columns: <strong>{columns}</strong></p>
                    <SecondarySlider
                        value={columns}
                        onChange={updateColumns}
                        min={2}
                        max={10}
                        className="h-5 slider-thumb:w-8 slider-thumb:h-5 transition duration-200"
                    />
                </div>

                <div className="w-56">
                    <p className="mb-1.5 text-sm"># in a row to win: <strong>{needed}</strong></p>
                    <SecondarySlider
                        value={needed}
                        onChange={setNeeded}
                        min={2}
                        max={Math.max(rows, columns)}
                        className="h-5 slider-thumb:w-8 slider-thumb:h-5 transition duration-200"
                    />
                </div>
            </section>

            <OfflineMoveIndicator
                status={gameStatus}
                currPlayer={playerSymbol}
                first={<strong className="text-red-400">✕</strong>}
                second={<strong className="text-blue-400">◯</strong>}
                resetBoard={resetBoard}
            />
        </main>
    )
}
