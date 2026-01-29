import { Question } from '../types';

interface Props {
  score: number;
  total: number;
  questions: Question[];
  answers: number[];
  onReset: () => void;
}

export default function ResultsScreen({
  score,
  total,
  questions,
  answers,
  onReset,
}: Props) {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
      <h2 className="text-4xl font-black mb-6">النتيجة</h2>
      <p className="text-2xl mb-10">
        {score} / {total}
      </p>

      {questions.map((q, i) => (
        <p key={i} className="text-right text-sm mb-2">
          {q.question} — إجابتك:{' '}
          {answers[i] !== undefined ? q.options[answers[i]] : '—'}
        </p>
      ))}

      <button
        onClick={onReset}
        className="mt-10 bg-indigo-600 text-white px-8 py-4 rounded-xl"
      >
        إعادة اللعب
      </button>
    </div>
  );
}
