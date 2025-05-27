import { useState } from 'react';
import useRandomCountry from './use-random-country';

export default function useQuiz() {
  // const [quiz, setQuiz] = useState({
  //   done: [],
  //   corrrect: 0,
  //   answer: '',
  //   region: 'World'
  // });

  const { name, capital, latlng } = useRandomCountry({ region: 'World' });
  console.log('useQuiz', { name, capital, latlng });
}
