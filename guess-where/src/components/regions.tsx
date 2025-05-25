import { useState } from 'react';
import { byRegion } from '../assets/countries.json';

export default function Regions() {
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
    <div className="inline-flex flex-col">
      <h3 className="font-semibold my-2">Currently exploring the {region}</h3>
      <ul>
        {['World', ...Object.keys(byRegion)].map((region) => (
          <li key={region}>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="region"
                value={region.toLowerCase()}
                id={`region${region.replace(/ /g, '')}`}
                data-title={region}
                className="mr-2"
                onClick={handleOnClick}
                defaultChecked={region === 'World'}
              />
              {region}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
