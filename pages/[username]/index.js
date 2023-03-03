//this page can be accessed via www.url.com/anything - this 'anything' will be usernames
import { getUserWithUsername, postToJSON, firestore } from '../../lib/firebase';
import { query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';
import UserProfile from '../../components/UserProfile';
import Metatags from '../../components/Metatags';
import PostFeed from '../../components/PostFeed';

//we user serverside rendering here (SSR) because this page won't rendered in real time and it will poblic
export async function getServerSideProps({ query: urlQuery }) { //anytime this page is requested next.js will run this function
    const { username } = urlQuery;
  
    const userDoc = await getUserWithUsername(username); //we fetch the user document based on this username using the custom getUserWithUsername function impored from lib/firebase.js
  
    // If no user, short circuit to 404 page
    if (!userDoc) {
      return {
        notFound: true,  //returning object notFound: true will tell next to render a 404page
      };
    }
  
    // JSON serializable data
    let user = null;
    let posts = null;
  
    if (userDoc) {
      user = userDoc.data();
      // const postsQuery = userDoc.ref
      //   .collection('posts')
      //   .where('published', '==', true)
      //   .orderBy('createdAt', 'desc')
      //   .limit(5);
  
      const postsQuery = query(               //we query the posts
        collection(getFirestore(), userDoc.ref.path, 'posts'),  //we use the user document reference
        where('published', '==', true),  //only if published
        orderBy('createdAt', 'desc'), //order by created and descending
        limit(5)  //only display 5 posts
      );
      posts = (await getDocs(postsQuery)).docs.map(postToJSON);  //we get a list of all posts here (we use posttoJSON because this data needs to be serialized by JSON but its not because there is a timestamp type object) we get this posttojson function from lib/firebase
    }

   
  
    return {
      props: { user: user || null, posts: posts }, // will be passed to the page component as props
    };
  }
  
  export default function UserProfilePage({ user, posts }) {
    return (
      <main className='userProfilePage'>
        <Metatags title={user.username} description={`${user.username}'s public profile`} />
        <UserProfile user={user} />
        <PostFeed posts={posts} />
      </main>
    );
  }
  