import { useCallback, useEffect, useState, useTransition } from 'react';
import { getRandomCountries } from '../utils';
import type { Region } from '../types';
import { Check, MapPinCheckInside, MapPinXInside, X } from 'lucide-react';

export default function Guesses({
  region,
  map,
  onCorrectGuess,
  onNextStep
}: {
  region: Region;
  map?: google.maps.Map;
  onCorrectGuess: () => void;
  onNextStep: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedGuess, setSelectedGuess] = useState<
    ReturnType<typeof getRandomCountries>[0] | null
  >(null);
  const [answer, setAnswer] = useState<
    ReturnType<typeof getRandomCountries>[0] | null
  >(null);
  const [guesses, setGuesses] = useState<ReturnType<typeof getRandomCountries>>(
    []
  );

  const loadGuesses = useCallback(
    function loadGuesses() {
      setSelectedGuess(null);
      const newGuesses = getRandomCountries({ region, range: 4 });
      const ans = newGuesses[Math.floor(Math.random() * newGuesses.length)];
      setGuesses(newGuesses);
      setAnswer(ans);

      if (map) {
        map.panTo(
          new google.maps.LatLng({
            lat: ans.latlng.lat,
            lng: ans.latlng.lng
          })
        );
      }
    },
    [map, region]
  );

  useEffect(() => {
    loadGuesses();
  }, [loadGuesses]);

  return (
    <div className="flex flex-col py-2">
      <h3 className="font-semibold mb-2 text-gray-500">Guess the place</h3>
      <ul className="grid grid-cols-2 gap-2 md:block md:[&>*+*]:mt-2 md:min-h-[245px]">
        {guesses.map((guess) => {
          const isCorrect =
            selectedGuess?.id === guess.id && selectedGuess?.id === answer?.id;
          const isInCorrect =
            selectedGuess?.id === guess.id && selectedGuess.id !== answer?.id;
          const wasCorrect =
            selectedGuess &&
            selectedGuess?.id !== answer?.id &&
            guess.id === answer?.id;

          return (
            <li key={guess.id}>
              <button
                disabled={isPending || selectedGuess !== null}
                type="button"
                name={guess.id}
                className={`cursor-pointer block p-2.5 py-1.5 rounded-md text-left text-white font-semibold w-full focus:outline-none transition-colors duration-150 bg-cyan-500/80 ${isInCorrect && 'bg-red-500'} ${wasCorrect && 'bg-green-500'} ${isCorrect && 'bg-green-500'}`}
                onClick={() => {
                  startTransition(() => {
                    if (isPending) return;

                    setSelectedGuess(guess);
                    onNextStep();

                    if (guess.id === answer?.id) {
                      onCorrectGuess();
                    }

                    setTimeout(() => {
                      loadGuesses();
                    }, 800);
                  });
                }}
              >
                <div className="flex items-center justify-between pointer-events-none">
                  <div>
                    {guess.capital}
                    <small className="block text-gray-900">{guess.name}</small>
                  </div>
                  {(isCorrect || wasCorrect) && (
                    <Check size={26} className="text-white" />
                  )}
                  {isInCorrect && <X size={26} className="text-white" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
