import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBzGJ-ekEbMkMqN8rZcX3CR36nXoy0UPcw",
  authDomain: "exchangetools-aece7.firebaseapp.com",
  projectId: "exchangetools-aece7",
  storageBucket: "exchangetools-aece7.appspot.com",
  messagingSenderId: "1037529137376",
  appId: "1:1037529137376:web:e9589e1625abae2ff65085",
  measurementId: "G-GGJNVZF72E"
};

/*
const firebaseConfig = {
  apiKey: "AIzaSyDmdFs8pM-SfbUqJuZeBkYEJcaPoPKZqDg",
  authDomain: "dailyprojects-sharetools.firebaseapp.com",
  projectId: "dailyprojects-sharetools",
  storageBucket: "dailyprojects-sharetools.appspot.com",
  messagingSenderId: "315131374160",
  appId: "1:315131374160:web:92718e71b899e836eaff55",
  measurementId: "G-KSF9FGQVX7"
};

*/

// Initialize firebase
// let firebaseApp;
// let firestore;
// if (!getApps().length) {
//   // firebase.initializeApp(firebaseConfig);
//   initializeApp(firebaseConfig);
//   firestore = getFirestore();
// }

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);



// Auth exports
// export const auth = firebase.auth();
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);
// export const firestore = firebase.firestore();
// export { firestore };
// export const serverTimestamp = serverTimestamp;
// export const fromMillis = fromMillis;
// export const increment = increment;

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

/// Helper functions


/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  // const usersRef = collection(firestore, 'users');
  // const query = usersRef.where('username', '==', username).limit(1);

  const q = query(
    collection(firestore, 'users'), //make the reference to the users collection
    where('username', '==', username),  //runs the query where the username is the current username
    limit(1)  //return the first hit from that query
  )
  const userDoc = ( await getDocs(q) ).docs[0];
  return userDoc;  //we return the user document
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
    startDate: data?.startDate.toMillis() || 0,
    endDate: data?.endDate.toMillis() || 0,
  };
}
