import { useState } from 'react';

export default function useQuiz() {
  const [quiz, setQuiz] = useState({
    done: [],
    corrrect: 0,
    answer: '',
    region: 'World'
  });
}
