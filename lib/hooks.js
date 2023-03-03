import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {         //we need this useEffect to listen to real time updates of the document
    // turn off realtime subscription
    let unsubscribe;

    if (user) {                  
      // const ref = firestore.collection('users').doc(user.uid);
      const ref = doc(getFirestore(), 'users', user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {     //if there is no user, then we set username to null
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
