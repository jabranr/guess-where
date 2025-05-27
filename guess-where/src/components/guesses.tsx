import { useEffect, useState, useTransition } from 'react';
import useRandomCountry from '../hooks/use-random-country';
import type { RandomCountry, Region } from '../types';
import { shuffleArray } from '../utils';
import { MapPinCheckInside } from 'lucide-react';

export default function Guesses({
  region,
  setScore,
  setGoes
}: {
  region: Region;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setGoes: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isPending, startTransition] = useTransition();
  const [guessedCorrectly, setGuessedCorrectly] =
    useState<RandomCountry | null>(null);
  const correctGuess = useRandomCountry({ region });
  const getMinimumGuesses = shuffleArray<RandomCountry[]>([
    correctGuess,
    useRandomCountry({ region }),
    useRandomCountry({ region }),
    useRandomCountry({ region })
  ]);

  useEffect(() => {
    setGuessedCorrectly(null);
  }, []);

  return (
    <div className="flex flex-col py-2">
      <h3 className="font-semibold mb-2 text-gray-500">Guess the place</h3>
      <ul className="[&>*+*]:mt-2 min-h-[245px]">
        {getMinimumGuesses.map((guess) => (
          <li key={guess.capital + Math.random()}>
            <button
              disabled={isPending}
              type="button"
              name="region"
              className={`cursor-pointer block p-2.5 py-1.5 rounded-md text-left text-white font-semibold w-full bg-cyan-500/80 hover:bg-cyan-600 focus:bg-cyan-800 focus:outline-none ${guessedCorrectly && (correctGuess?.name !== correctGuess.name ? 'bg-green-600' : 'bg-red-400')}`}
              onClick={() => {
                startTransition(() => {
                  if (isPending) return;
                  setGoes((prevGoes: number) => prevGoes + 1);
                  setScore((prevScore: number) => {
                    if (guess.capital === correctGuess.capital) {
                      setGuessedCorrectly(correctGuess);
                      return prevScore + 1;
                    }

                    return prevScore;
                  });
                });
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  {guess.capital}
                  <small className="block text-gray-900">{guess.name}</small>
                </div>
                {guessedCorrectly &&
                  (correctGuess?.name === guess.name ? (
                    <MapPinCheckInside size={26} />
                  ) : null)}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
