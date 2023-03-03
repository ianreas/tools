import Link from 'next/link'
import Image from 'next/image'
import { firestore } from '../lib/firebase';
import { getDoc, doc} from 'firebase/firestore';
import moment from 'moment'


export default function PostFeed({posts, admin}) { //admin is just a boolean that will be used to render additional UI on the admin page cause this PostFeed component will also be used for the admin page
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug}/>) : null //we map a list of posts to an individual PostItem component
}

function PostItem({post, admin = false}) {
    // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  let finalstartFormat

 /*  let startD 
  if (post.startDate){
    startD = new Date(post.startDate.seconds*1000)
    //console.log(startD.toISOString())
   finalstartFormat = moment(startD.toISOString()).format('YYYY-MM-DD HH:mm:ss')
  }

  let finalendFormat
  let endD
  if (post.endDate){
    endD = new Date(post.endDate.seconds*1000)
    finalendFormat = moment(endD.toISOString()).format('YYYY-MM-DD HH:mm:ss')
  } */


  function convertEpochToDateTime(epochTime) {
    var date = new Date(epochTime);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
  
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  }
  
  





  return (
    <div className="card">
      <div className='theimage'>
      {post.pictureCode ? <img src={post.pictureCode} alt='toolpic' className='feedimage'></img> : <div>No pic</div>}
      
      </div>
      <div className='info'>
      <Link legacyBehavior href={`/${post.username}/${post.slug}`}>
        <h2 className='toolname'>
          <a>{post.title}</a>
        </h2>
      </Link>
      <div className='addressinfo'>
        <p>{post.address?.address ? post.address.address : <></>}</p>
      </div>

      <div className='dateinfo'>
        <p>Available on:</p>
        <p>{convertEpochToDateTime(post.startDate) }</p>
        <p>Return By:</p>
        <p>{convertEpochToDateTime(post.endDate)}</p>
        <p>Exchange For: {post.exchangeFor}</p>
      </div>


      <Link legacyBehavior href={`/${post.username}`}>
        <a className='bywhom'>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      
      

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
        </>
      )}
      </div>
    </div>
  );
}