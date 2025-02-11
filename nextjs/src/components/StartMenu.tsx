export default function StartMenu({ setScreen }: { setScreen: (screen: string) => void }) {
    return (
        <div className="screen active">
            <div className="container">
                <h1 id="game-title">Your Game Title</h1>
                <button onClick={() => setScreen("game")}>Play</button>
                <button onClick={() => setScreen("settings")}>Settings</button>
                <button onClick={() => setScreen("instructions")}>Instructions</button>
            </div>
        </div>
    );
}
