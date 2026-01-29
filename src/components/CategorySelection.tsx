import { Category, CategoryInfo } from '../types';

interface Props {
  categories: CategoryInfo[];
  onSelect: (c: Category) => void;
}

export default function CategorySelection({ categories, onSelect }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="p-8 bg-white rounded-2xl shadow hover:shadow-xl transition"
        >
          <div
            className={`text-5xl mb-4 ${c.color} text-white p-4 rounded-full`}
          >
            {c.icon}
          </div>
          <h3 className="font-bold text-xl">{c.title}</h3>
          <p className="text-sm text-slate-500">{c.description}</p>
        </button>
      ))}
    </div>
  );
}
