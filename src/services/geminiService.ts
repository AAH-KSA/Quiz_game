import { Category, Question } from '../types';

export const generateQuestions = async (
  category: Category,
  count: number = 5
): Promise<Question[]> => {
  const questions: Record<Category, Question[]> = {
    religious: [
      {
        id: 'r1',
        question: 'من هو أول من آمن من الرجال؟',
        options: [
          'أبو بكر الصديق',
          'عمر بن الخطاب',
          'علي بن أبي طالب',
          'عثمان بن عفان',
        ],
        correctAnswer: 0,
        explanation: 'أبو بكر الصديق رضي الله عنه أول من آمن من الرجال.',
      },
    ],
    geographical: [
      {
        id: 'g1',
        question: 'كم عدد قارات العالم؟',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        explanation: 'عدد قارات العالم هو 7.',
      },
    ],
    societal: [
      {
        id: 's1',
        question: 'أي مما يلي يعد من القيم المجتمعية؟',
        options: ['التعاون', 'الأنانية', 'الفوضى', 'الإهمال'],
        correctAnswer: 0,
        explanation: 'التعاون من أهم القيم المجتمعية.',
      },
    ],
    national: [
      {
        id: 'n1',
        question: 'ما هي عاصمة المملكة العربية السعودية؟',
        options: ['جدة', 'مكة', 'الرياض', 'الدمام'],
        correctAnswer: 2,
        explanation: 'الرياض هي عاصمة المملكة العربية السعودية.',
      },
    ],
  };

  return questions[category].slice(0, count);
};
