import Levels, { type Level } from './components/levels';
import Regions from './components/regions';
import Guesses from './components/guesses';
import Footer from './components/gooter';
import BaseMap from './components/base-map';
import Header from './components/header';
import ScoreCard from './components/score-card';
import { useState } from 'react';
import type { Region } from './types';

export default function App() {
  const [score, setScore] = useState(0);
  const [goes, setGoes] = useState(0);
  const [region, setRegion] = useState<Region>('World');
  const [selectedLevel, setSelectedLevel] = useState<Level>('pro');

  return (
    <div>
      {/* <BaseMap level={selectedLevel} /> */}
      <aside className="absolute top-0 left-0 m-2 inset-0 overflow-hidden overflow-y-auto bg-white p-2 rounded-lg shadow-md w-full max-w-[300px] [&>*+*]:mt-2 [&>*+*]:pt-2.5 [&>*+*]:border-t-[1px] [&>*+*]:border-gray-200">
        <Header>
          <ScoreCard score={score} goes={goes} />
        </Header>
        <Levels
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />
        <Guesses region={region} setScore={setScore} setGoes={setGoes} />
        <Regions region={region} setRegion={setRegion} />
        <Footer />
      </aside>
    </div>
  );
}
