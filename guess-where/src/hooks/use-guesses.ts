import { useState } from 'react';
import countriesData from '../assets/countries.json';

export function useGuesses() {
  const [guesses, setGuesses] = useState(
    countriesData.capitals.slice(0, 4) // Example: First 4 capitals
  );

  function handleGuess(guess: string) {
    console.log('Guessed:', guess);
  }

  return { guesses, handleGuess };
}
