export default function GameOver({ setScreen }: { setScreen: (screen: string) => void }) {
    return (
        <div className="screen active">
            <div className="container">
                <h2>Game Over</h2>
                <button onClick={() => setScreen("game")}>Play Again</button>
                <button onClick={() => setScreen("start")}>Main Menu</button>
            </div>
        </div>
    );
}
