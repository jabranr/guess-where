const levels = [
  { value: 'pro', label: 'Pro', checked: true },
  { value: 'advance', label: 'Advance', checked: false },
  { value: 'easy', label: 'Easy', checked: false }
] as const;

export type Level = (typeof levels)[number]['value'];

export default function Levels({
  selectedLevel,
  setSelectedLevel
}: {
  selectedLevel: Level;
  setSelectedLevel: React.Dispatch<React.SetStateAction<Level>>;
}) {
  const handleLavelChange = (ev: React.MouseEvent<HTMLInputElement>) => {
    setSelectedLevel(ev.currentTarget.value as Level);
  };

  return (
    <div className="flex items-center gap-1">
      {/* <strong className="text-sm text-gray-500">Levels:</strong> */}
      {levels.map((level) => {
        const isSelected = level.value === selectedLevel;

        return (
          <label
            key={level.value}
            className={`transition-colors duration-150 uppercase font-semibold  p-2 text-xs py-1 rounded-md cursor-pointer ${!isSelected ? 'hover:bg-gray-300' : ''} ${isSelected ? 'text-white bg-gray-500' : ' bg-gray-200'}`}
          >
            <input
              type="radio"
              name="level"
              value={level.value}
              className="sr-only"
              onClick={handleLavelChange}
              defaultChecked={level.checked}
              aria-label={`Select ${level.label} mode`}
              aria-checked={isSelected ? 'true' : 'false'}
            />
            {level.label}
          </label>
        );
      })}
    </div>
  );
}
