import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB2NnjmUt0wvJxP_kWZTrwKAFbNLnQ2hOU',
  authDomain: 'quiz-3ef4c.firebaseapp.com',
  projectId: 'quiz-3ef4c',
  storageBucket: 'quiz-3ef4c.firebasestorage.app',
  messagingSenderId: '82246785544',
  appId: '1:82246785544:web:3b55103b6a3bedd7160fbd',
  measurementId: 'G-S417906LG4',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
