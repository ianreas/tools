import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username ? props.children : props.fallback || <Link href="/enter"><h3 className='mustsignin'>You must be signed in</h3></Link>;   //Auth check will only render its children only if the user is authenticated!!!
}                                                                                                          //if they are not authenticated it will direct them back to the sign in page
