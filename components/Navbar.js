import Link from 'next/link'
import { useContext } from 'react'
import {UserContext} from '../lib/context'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
    const {user, username} = useContext(UserContext)  //navbar component now can access the user and username using useContext


    const router = useRouter();

    const signOutNow = () => {              //user?.photoURL || in src for photo
    signOut(auth);
    router.reload();
  }

    return (
        <nav className='navbar'>
            <ul>
            <li>     {/* goes to www.url.com/username */}
                        <Link legacyBehavior href={`/${username}`}>       
                            <div>
                            {/* <img src={'../biggertool.jpg'} /> */}
                            <h1 className='logo-name'>Toolio</h1>
                            </div>
                        </Link>
                    </li>
                <li>
                    <Link legacyBehavior href='/'>
                        <button className='btn-logo'>see tools</button>
                    </Link>
                </li>

                {/*user is signed in and has a username */}
                {username && (
                    <>
                    
                    <li>    {/* goes to the admin page where user can share their tool */}
                        <Link legacyBehavior href='/admin'>                        
                            
                            <button className='btn-blue'>make a post</button>
                            
                        </Link>
                    </li>
                    <li className="push-left">
                        <button onClick={signOutNow}>sign out</button>
                    </li>
                    </>
                )}

                {/*user is not signed in or has not created a username */}
                {!username && (
                    <>
                        <li>
                            <Link legacyBehavior href='/enter'>
                                <button className='btn-logo'>Log in</button>
                            </Link>
                        </li>
                    </>

)}
            </ul>
        </nav>
    )
}