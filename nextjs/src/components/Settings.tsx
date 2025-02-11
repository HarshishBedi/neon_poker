export default function Settings({ setScreen }: { setScreen: (screen: string) => void }) {
    return (
        <div className="screen active">
            <div className="container">
                <h2>Settings</h2>
                <button onClick={() => setScreen("start")}>Back</button>
            </div>
        </div>
    );
}
