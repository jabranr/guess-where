import { useState } from 'react';
import { getRandomCountries } from '../utils';

export default function useQuiz() {
  // const [quiz, setQuiz] = useState({
  //   done: [],
  //   corrrect: 0,
  //   answer: '',
  //   region: 'World'
  // });

  const randomCountries = getRandomCountries({ region: 'World' });
  console.log('useQuiz', { randomCountries });
}
