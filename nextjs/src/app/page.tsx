"use client";
import { useState } from "react";
import StartMenu from "@/components/StartMenu";
import Instructions from "@/components/Instructions";
import Settings from "@/components/Settings";
import GameScreen from "@/components/GameScreen";
import GameOver from "@/components/GameOver";

export default function Home() {
  const [screen, setScreen] = useState("start");

  return (
    <div>
      {screen === "start" && <StartMenu setScreen={setScreen} />}
      {screen === "instructions" && <Instructions setScreen={setScreen} />}
      {screen === "settings" && <Settings setScreen={setScreen} />}
      {screen === "game" && <GameScreen setScreen={setScreen} />}
      {screen === "gameover" && <GameOver setScreen={setScreen} />}
    </div>
  );
}
