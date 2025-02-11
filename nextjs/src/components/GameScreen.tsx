import Controls from "@/components/Controls";
import Hud from "./Hud";

export default function GameScreen({ setScreen }: { setScreen: (screen: string) => void }) {
    return (
        <>
            <Controls /* setScreen={setScreen} */ />

            <Hud />

            <div className="screen active">
                {/* Game Container */}
                <div id="game-container">
                    <h2>Game Screen</h2>

                    {/* Player 1 */}
                    <div className="player-area">
                        <h2>Player 1</h2>
                        <div id="player1-cards"></div>
                        <p>Chips: <span id="player1-chips">1000</span></p>
                    </div>

                    {/* Player 2 */}
                    <div className="player-area">
                        <h2>Player 2</h2>
                        <div id="player2-cards"></div>
                        <p>Chips: <span id="player2-chips">1000</span></p>
                    </div>

                    {/* Community Cards */}
                    <div className="community-area">
                        <h2>Community Cards</h2>
                        <div id="community-cards"></div>
                    </div>

                    {/* Betting Section */}
                    <div className="betting-section">
                        <h3>Current Pot: <span id="pot">0</span></h3>
                        <label>Bet Amount:
                            <input type="number" id="bet-amount" min="10" defaultValue="10" />
                        </label>
                        <button id="bet-button">Bet</button>
                        <button id="fold-button">Fold</button>
                    </div>

                    {/* Showdown Modal */}
                    <div id="showdown-modal">
                        <h2 id="winner-message"></h2>
                        <button onClick={() => setScreen("game")}>New Game</button>
                    </div>
                </div>
            </div>
        </>
    );
}
