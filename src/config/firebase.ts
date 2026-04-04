// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDBkFCEyqA2AvUhH1H5inOjjXsqZtYfeBg',
  authDomain: 'thesis-16a88.firebaseapp.com',
  projectId: 'thesis-16a88',
  storageBucket: 'thesis-16a88.firebasestorage.app',
  messagingSenderId: '885077821924',
  appId: '1:885077821924:web:a6d1af2ec6dc9540015ff1',
  measurementId: 'G-KC1Y0BMNVD',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
