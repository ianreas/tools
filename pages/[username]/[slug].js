import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';
import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';


import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';


export async function getStaticProps({ params }) {             //getStaticProps tells next to fetch the data on the server on build time to prerender it in advance
  const { username, slug } = params;                       //grabbing username and slug from url parameters
  const userDoc = await getUserWithUsername(username);          //use username to get the username document

  let post;
  let path;

  if (userDoc) {                                                                  //if username exists  on the firestore refrence the post using the slug as the id
    // const postRef = userDoc.ref.collection('posts').doc(slug);
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);           //fetch post data and post reference

    // post = postToJSON(await postRef.get());
    //post = postToJSON(await getDoc(postRef) );     
    post = JSON.parse(JSON.stringify(await getDoc(postRef)))                                   //convert to JSON

    path = postRef.path;     //setting prop for path so its easier refetch the data on the client side when we want to hydrate it to the real time data from the firestore
  }

  return {
    props: { post : post || null, path : path || null},                                                  //return props from the function                                        
    revalidate: 100,                                                      //revalidate tells next.js to regenerate the page on the SERVER  when the new requests come in but only once in 100 ms
  };
}

export async function getStaticPaths() {                         //determining which actual pages to render by telling next which paths to render
  // Improve my using Admin SDK to select empty docs
  const q = query(                              //quering all the posts in the database
    collectionGroup(getFirestore(), 'posts'), //we use collection group to get the posts
    limit(20)
  )
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {  //we map each posts 
    const { slug, username } = doc.data();
    return {
      params: { slug : slug || null, username : username || null }, //url params
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',        //if the user is trying to open the page that hasn't been prerendered yet it tells next to fallback to regular server side rendering SSR. once it renders the page then it can be cached on CDN and next time it can implement the ISR and prerendering
  };
}

export default function Post(props) {
  const postRef = doc(getFirestore(), props.path);          //prop for the path to the document is used to make a reference to the database
  const [realtimePost] = useDocumentData(postRef);       //a react-firebase hook to get the feed of the data in REAL TIME

  const post = realtimePost || props.post;                  //post is defaulted to the realtime post data but if it's not loaded then it falls back to the prerendered data on the server

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />
      
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link legacyBehavior href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link legacyBehavior href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
