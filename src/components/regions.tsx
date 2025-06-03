import { byRegion } from '../assets/countries.json';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import type { Region } from '../types';
import { useState } from 'react';

export default function Regions({
  region,
  setRegion
}: {
  region: Region;
  setRegion: React.Dispatch<React.SetStateAction<Region>>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleOnClick(ev: React.MouseEvent<HTMLInputElement>) {
    setRegion(ev.currentTarget.value as Region);
  }

  return (
    <div className="flex flex-col w-full">
      <button
        className="cursor-pointer flex items-center gap-2 justify-between pr-2"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <h3 className="font-semibold my-2 text-gray-500">
          Currently exploring: {region}
        </h3>
        {isExpanded ? (
          <ChevronsDownUp className="text-gray-500" size={20} />
        ) : (
          <ChevronsUpDown className="text-gray-500" size={20} />
        )}
      </button>
      {isExpanded && (
        <ul>
          {['World', ...Object.keys(byRegion)].map((region) => (
            <li key={region}>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="region"
                  value={region}
                  id={`region${region.replace(/ /g, '')}`}
                  className="mr-2"
                  onClick={handleOnClick}
                  defaultChecked={region === 'World'}
                />
                {region}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
