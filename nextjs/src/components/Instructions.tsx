export default function Instructions({ setScreen }: { setScreen: (screen: string) => void }) {
    return (
        <div className="screen active">
            <div className="container">
                <h2>Instructions</h2>
                <h3>How to Play:</h3>
                <ul>
                    <li>Instruction 1</li>
                    <li>Instruction 2</li>
                </ul>
                <button onClick={() => setScreen("start")}>Back</button>
            </div>
        </div>
    );
}
