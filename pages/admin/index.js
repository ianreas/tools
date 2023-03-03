//this page can be accessed from www.url.com/admin

import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';



export default function AdminPostsPage(props) {                     //components inside of the authcheck will only render if the auth check renders so we don't have to do any conditions to check which content to render 
  return (  //we wrap components of this page with authcheck so the children of auth check will only be rendered if usernsme is signed in
    <main className='adminindex'>                  
      <AuthCheck>                   
        <PostList />               
        <CreateNewPost />
      </AuthCheck>
    </main>
  );              
}

function PostList() {       //this component renders a list of Posts                                                                           //shows all the posts that the user has created
  // const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
  // const query = ref.orderBy('createdAt');

  const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')         //reference to the current user document and then post subcollection 
  const postQuery = query(ref, orderBy('createdAt'))    //from that reference we can order by createdAt                              

  const [querySnapshot] = useCollection(postQuery);                     //useCollection hook from react firebase hooks to read collection in real time

  const posts = querySnapshot?.docs.map((doc) => doc.data());     //we map every document to data  (use useCollectionData for additional controls like the option to delete the post)  

  return (
    <>
      <h1 className='manageposts'>Manage your Posts</h1>
      <PostFeed posts={posts} admin /> {/* we pass the posts to PostFeed which is in the components folder */}
    </>
  );
}

function CreateNewPost() { //this component will allow us to create new posts
  const router = useRouter();                 //using next-router with useRouter hook
  const { username } = useContext(UserContext);      //grabbing username from useContext
  const [title, setTitle] = useState('');          //title is the value that the user is typing in the form

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title)); //encodeURI is built in the browser and ensures that the slug in url safe

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: 'add details and pictures of how you want to share your tool here',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      pictureCode: "",
      price: 0, 
      startDate: serverTimestamp(),
      endDate: serverTimestamp(),
      exchangeFor: "nothing"
    };

    await setDoc(ref, data);         //comitting data to the firestore

    toast.success('Post created!');

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Share Your Tool! What's the title of the post?"
        className={styles.input}
      />
      <p className={styles.slug}>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Add pictures and details
      </button>
    </form>
  );
}
