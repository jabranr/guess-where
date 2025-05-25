import { useState } from 'react';
import { byRegion, capitals } from '../assets/countries.json';

export default function Guesses() {
  const [region, setRegion] = useState('World');

  function handleOnClick(ev: React.MouseEvent<HTMLInputElement>) {
    if (ev.currentTarget.checked) {
      const region = ev.currentTarget.value;
      const title = String(ev.currentTarget.dataset.title);
      const event = new CustomEvent('regionSelected', {
        detail: { region }
      });

      setRegion(title);
      window.dispatchEvent(event);
    }
  }

  return (
    <div className="flex flex-col">
      <h3 className="font-semibold my-2">Guess the place</h3>
      <ul>
        {capitals.slice(0, 4).map((capital) => (
          <li key={capital}>
            <button
              type="button"
              name="region"
              className="cursor-pointer block p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
              // onClick={handleOnClick}
            >
              {capital}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
