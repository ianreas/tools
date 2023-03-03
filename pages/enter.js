import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { UserContext } from '../lib/context';
import Metatags from '../components/Metatags';
import styles from '../styles/Enter.module.css'
import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import Link from 'next/link';

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    
    <main className={user ? styles.signoutPage : styles.signinPage}>
      
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
      
    </main>
  
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)  //triggers a google sign in pop-up so the user can use google to log in/signup
  };

  return (
    <>
    <div className='textlogo'>
        Exchange your tools
    </div>
    <div className='signinbottoms'>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} width="30px" /> Sign in with Google
      </button>
      <button onClick={() => signInAnonymously(auth)}>
        Sign in Anonymously
      </button>
      </div>
    </>
  );
}

// Sign out button
function SignOutButton() {
  for (const link of document.getElementsByClassName('link')){
    link.onmousemove = e => {
      const decimal = e.clientX /link.offsetWidth

      const basePercent = 80,
      percentRange = 20,
      adjustbalePercent = percentRange*decimal;

      const lightBluePercent = basePercent + adjustbalePercent

      link.style.setProperty("--light-blue-percent", `${lightBluePercent}%`)
    }
  }


  return (
    <>
    <div>
      <h1 className={styles.intro}>Hello. Exchange tools or borrow them.</h1>
    </div>
    <div className={styles.signoutGradient}>
    <Link href='/' class={styles.link}>
      borrow some tools
    </Link>
    <Link href='admin' class={styles.link}>
      lend your tools
    </Link>
    </div>
    <button  className='btn-signout' onClick={() => signOut(auth)}>Sign Out</button> {/*sign out button and upon pressing it it triggers the signout method*/}
    
    </>
  )
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState(''); //the letters that the user is typing
  const [isValid, setIsValid] = useState(false); //this will tell us whether or not the username chosen is a valid selection
  const [loading, setLoading] = useState(false); //loading will be true while we are async checking whether or not the suername exists

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();  //prevents the default behavior which is to refresh the page

    // Create refs for both documents
    const userDoc = doc(getFirestore(), 'users', user.uid);  //user.uid uses the current users user id 
    const usernameDoc = doc(getFirestore(), 'usernames', formValue); //formValue is what the user typed

    // Commit both docs together as a batch write. committing means adding these documents
    const batch = writeBatch(getFirestore()); //we want both user and username succeeed or fail as a transcation we we set up a batch
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();  //commiting this write to the firestore
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {   //this useEffect is checking the entire username typed and accessing the database to check if its taken
    checkUsername(formValue);
  }, [formValue]); //anytime the value typed in the Form is changed it will run the useEffect

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(  //useCallback allows for this function to be memoized so it can be debounced between the state changes
    debounce(async (username) => { //debounce prevents the execution of the function until the last event has fired or until if 500 ms passed
      if (username.length >= 3) {  //if the length is more than 3 then this needs to be checked against the database
        const ref = doc(getFirestore(), 'usernames', username); //we make a reference to the location of the username document
        const snap = await getDoc(ref);  //checks if exists
        console.log('Firestore read executed!', snap.exists());
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className={styles.usernamepicking}>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="choosebutton" disabled={!isValid}>
            Choose
          </button>

        
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
