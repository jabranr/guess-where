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

  const [googleMap, setGoogleMap] = useState<google.maps.Map | undefined>(
    undefined
  );
  const [region, setRegion] = useState<Region>('World');
  const [selectedLevel, setSelectedLevel] = useState<Level>('pro');

  return (
    <div>
      <BaseMap level={selectedLevel} onSetup={(map) => setGoogleMap(map)} />
      <aside className="absolute inset-0 bottom-auto w-full bg-white/65 p-2 overflow-hidden shadow-md md:m-2 md:overflow-y-auto md:rounded-lg md:max-w-[300px] md:[&>*+*]:mt-2 md:[&>*+*]:pt-2.5 md:[&>*+*]:border-t-[1px] md:[&>*+*]:border-gray-200">
        <Header>
          <Levels
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
          />
          <ScoreCard score={score} goes={goes} />
        </Header>
        <div className="flex flex-col-reverse md:flex-col">
          <Guesses
            region={region}
            map={googleMap}
            onCorrectGuess={() => {
              setScore((prev) => prev + 1);
            }}
            onNextStep={() => {
              setGoes((prev) => prev + 1);
            }}
          />
          <Regions region={region} setRegion={setRegion} />
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
      </aside>
    </div>
  );
}
