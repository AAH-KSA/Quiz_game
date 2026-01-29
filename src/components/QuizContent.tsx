import { useEffect, useState } from 'react';
import { Category, Question } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  category: Category;
  question: Question;
  index: number;
  total: number;
  onAnswer: (i: number) => void;
}

export default function QuizContent({
  category,
  question,
  index,
  total,
  onAnswer,
}: Props) {
  const [answered, setAnswered] = useState<number | null>(null);
  const info = CATEGORIES.find((c) => c.id === category);

  useEffect(() => setAnswered(null), [question]);

  if (!info) return null;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">
        سؤال {index + 1} من {total}
      </h2>

      <p className="text-2xl font-black mb-6">{question.question}</p>

      {question.options.map((o, i) => (
        <button
          key={i}
          disabled={answered !== null}
          onClick={() => {
            setAnswered(i);
            setTimeout(() => onAnswer(i), 1000);
          }}
          className="block w-full text-right p-4 mb-3 border rounded-xl"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
