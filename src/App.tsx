import { useEffect, useState } from 'react';
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  getDoc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

/* ======================
   الأسئلة (5)
====================== */
const QUESTIONS = [
  {
    q: 'من هو أول الخلفاء الراشدين؟',
    options: ['عمر', 'علي', 'أبو بكر', 'عثمان'],
    correct: 2,
  },
  {
    q: 'كم عدد أركان الإسلام؟',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    q: 'في أي شهر يصوم المسلمين؟',
    options: ['شعبان', 'رمضان', 'محرم', 'ذو الحجة'],
    correct: 1,
  },
  {
    q: 'أين نزل الوحي؟',
    options: ['غار حراء', 'المدينة', 'الطائف', 'بدر'],
    correct: 0,
  },
  {
    q: 'كم عدد الصلوات المفروضة؟',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
];

type Status = 'IDLE' | 'LOBBY' | 'QUESTION' | 'FINAL';

export default function App() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [role, setRole] = useState<'HOST' | 'PLAYER' | null>(null);
  const [status, setStatus] = useState<Status>('IDLE');
  const [players, setPlayers] = useState<any[]>([]);
  const [timer, setTimer] = useState(15);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerId, setPlayerId] = useState('');
  const [answeredLocal, setAnsweredLocal] = useState(false);

  /* ======================
     Realtime listeners
  ======================= */
  useEffect(() => {
    if (!roomCode) return;

    const unsubRoom = onSnapshot(doc(db, 'rooms', roomCode), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();

      // ⬅️ الرجوع للجميع للصفحة الرئيسية
      if (d.status === 'IDLE') {
        setRole(null);
        setRoomCode('');
        setPlayerId('');
        setStatus('IDLE');
        return;
      }

      setStatus(d.status);
      setTimer(d.timer);
      setCurrentQuestion(d.currentQuestion);
      setAnsweredLocal(false);
    });

    const unsubPlayers = onSnapshot(
      collection(db, 'rooms', roomCode, 'players'),
      (snap) => {
        setPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [roomCode]);

  /* ======================
     Timer (HOST فقط)
  ======================= */
  useEffect(() => {
    if (role !== 'HOST' || status !== 'QUESTION') return;

    if (timer <= 0) {
      setTimeout(() => nextQuestion(), 1000);
      return;
    }

    const t = setTimeout(async () => {
      await updateDoc(doc(db, 'rooms', roomCode), {
        timer: timer - 1,
      });
    }, 1000);

    return () => clearTimeout(t);
  }, [timer, status, role]);

  /* ======================
     Actions
  ======================= */

  const createRoom = async () => {
    if (!name.trim()) {
      alert('أدخل اسمك');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await setDoc(doc(db, 'rooms', code), {
      status: 'LOBBY',
      currentQuestion: 0,
      timer: 15,
    });

    const p = await addDoc(collection(db, 'rooms', code, 'players'), {
      name,
      score: 0,
      answered: false,
      isCorrect: null,
    });

    setRoomCode(code);
    setPlayerId(p.id);
    setRole('HOST');
    setStatus('LOBBY');
  };

  const joinRoom = async () => {
    if (!name.trim() || !roomCode.trim()) {
      alert('أدخل الاسم ورقم الغرفة');
      return;
    }

    const roomSnap = await getDoc(doc(db, 'rooms', roomCode));
    if (!roomSnap.exists()) {
      alert('الغرفة غير موجودة');
      return;
    }

    if (roomSnap.data().status !== 'LOBBY') {
      alert('❌ لا يمكن الانضمام، اللعبة بدأت بالفعل');
      return;
    }

    const p = await addDoc(collection(db, 'rooms', roomCode, 'players'), {
      name,
      score: 0,
      answered: false,
      isCorrect: null,
    });

    setPlayerId(p.id);
    setRole('PLAYER');
    setStatus('LOBBY');
  };

  const startGame = async () => {
    await updateDoc(doc(db, 'rooms', roomCode), {
      status: 'QUESTION',
      currentQuestion: 0,
      timer: 15,
    });
  };

  const nextQuestion = async () => {
    for (const p of players) {
      await updateDoc(doc(db, 'rooms', roomCode, 'players', p.id), {
        answered: false,
        isCorrect: null,
      });
    }

    if (currentQuestion >= QUESTIONS.length - 1) {
      await updateDoc(doc(db, 'rooms', roomCode), { status: 'FINAL' });
    } else {
      await updateDoc(doc(db, 'rooms', roomCode), {
        currentQuestion: currentQuestion + 1,
        timer: 15,
      });
    }
  };

  // 🔄 إعادة الجميع للصفحة الرئيسية
  const resetToHome = async () => {
    await updateDoc(doc(db, 'rooms', roomCode), {
      status: 'IDLE',
      currentQuestion: 0,
      timer: 15,
    });
  };

  const submitAnswer = async (index: number) => {
    if (answeredLocal || timer <= 0) return;

    const me = players.find((p) => p.id === playerId);
    if (me?.answered) return;

    setAnsweredLocal(true);

    const correct = index === QUESTIONS[currentQuestion].correct;
    const score = correct ? 100 + timer * 10 : 0;

    await updateDoc(doc(db, 'rooms', roomCode, 'players', playerId), {
      answered: true,
      isCorrect: correct,
      score: increment(score),
    });
  };

  /* ======================
     UI
  ======================= */

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="bg-white/10 p-8 rounded-2xl w-80">
          <input
            className="w-full p-3 mb-3 text-black rounded"
            placeholder="اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="w-full bg-yellow-400 py-3 mb-3 font-bold rounded"
          >
            إنشاء غرفة (مضيف)
          </button>
          <input
            className="w-full p-3 mb-3 text-black rounded"
            placeholder="رمز الغرفة"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="w-full bg-white/20 py-3 rounded"
          >
            انضمام كلاعب
          </button>
        </div>
      </div>
    );
  }

  if (status === 'LOBBY') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <h2 className="mb-4 text-xl">
          رمز الغرفة: <b className="text-yellow-400">{roomCode}</b>
        </h2>

        {role === 'HOST' ? (
          <button
            onClick={startGame}
            className="bg-green-500 px-10 py-4 rounded-xl font-black text-xl"
          >
            بدء اللعبة
          </button>
        ) : (
          <p className="animate-pulse">⏳ بانتظار المضيف لبدء اللعبة...</p>
        )}
      </div>
    );
  }

  if (status === 'QUESTION') {
    const q = QUESTIONS[currentQuestion];
    return (
      <div className="min-h-screen bg-indigo-700 p-6 text-white">
        <h2 className="text-center mb-4 text-2xl">⏱️ {timer}</h2>
        <h1 className="text-xl text-center mb-6">{q.q}</h1>

        <div className="grid gap-3 mb-6">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => submitAnswer(i)}
              disabled={answeredLocal}
              className="bg-white text-indigo-900 py-3 rounded font-bold"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="bg-white/10 p-4 rounded-xl">
          <h3 className="text-center mb-2 font-bold">إجابات اللاعبين</h3>
          {players.map((p) => (
            <div key={p.id}>
              {p.name} —
              {!p.answered ? ' ⏳' : p.isCorrect ? ' ✅ صح' : ' ❌ خطأ'}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'FINAL') {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="min-h-screen bg-emerald-600 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-6">🏆 النتائج النهائية</h1>

        {sorted.map((p, i) => (
          <div key={p.id} className="text-xl mb-2">
            {i + 1}. {p.name} — {p.score}
          </div>
        ))}

        {role === 'HOST' && (
          <button
            onClick={resetToHome}
            className="mt-8 bg-white text-emerald-700 px-10 py-4 rounded-xl font-black text-xl"
          >
            🔄 بدء لعبة جديدة
          </button>
        )}
      </div>
    );
  }

  return null;
}
