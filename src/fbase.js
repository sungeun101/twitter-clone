import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDxG9WDNe85BeJTf_omp6kBTC0XHJp5IP0',
  authDomain: 'twitter-clone-c5a2a.firebaseapp.com',
  databaseURL: 'https://twitter-clone-c5a2a.firebaseio.com',
  projectId: 'twitter-clone-c5a2a',
  storageBucket: 'twitter-clone-c5a2a.appspot.com',
  messagingSenderId: '696147217556',
  appId: '1:696147217556:web:e1ac207ca9a6b6246fb881',
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

// 파일 전체를 export 하지않고 필요한 부분만 export 가능
export const authService = firebase.auth();
export const dbService = firebase.firestore(); // enable real-time updates. stores data in Documents, which are stored in Collections.
export const storageService = firebase.storage(); // Your data is stored in a Google Cloud Storage bucket
