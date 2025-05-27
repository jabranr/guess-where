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
    <div className="flex items-center gap-2">
      <strong>Levels:</strong>
      {levels.map((level) => {
        const isSelected = level.value === selectedLevel;

        return (
          <label
            key={level.value}
            className={`uppercase font-semibold  p-2 text-xs py-1 rounded-md cursor-pointer hover:bg-cyan-500 ${isSelected ? 'text-white bg-cyan-400' : ' bg-gray-100'}`}
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
