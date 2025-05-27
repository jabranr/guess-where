type Props = {
  score: number;
  goes: number;
};

export default function ScoreCard({ score, goes }: Props) {
  return (
    <p className="font-semibold text-green-800">
      Score:{' '}
      <span className="font-light">
        <span className="text-2xl">{score}</span> / {goes}
      </span>
    </p>
  );
}
