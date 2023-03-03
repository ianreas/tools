import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image'
import moment from 'moment'

// UI component for main post content
export default function PostContent({ post }) {
  
  //const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();     //making sure that we are rendering createdAt in the correct format

  //const endDate = typeof post?.endDate === 'number' ? new Date(post.endDate) : post.endDate.toDate()


  let startD
  let updateD
  let finalstartFormat
  let finalupdateFormat
  if (post.startDate){
    startD = new Date(post.startDate.seconds*1000)
    //console.log(startD.toISOString())
   finalstartFormat = moment(startD.toISOString()).format('YYYY-MM-DD HH:mm:ss')
  }

  /*
  if (post.updatedAt){
    updateD = new Date(post.updateAt.seconds*1000)
    //console.log(startD.toISOString())
   finalupdateFormat = moment(updateD.toISOString()).format('YYYY-MM-DD HH:mm:ss')
  }
  */

  return (
    <div className="card">
      
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link legacyBehavior href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {/*createdAt.toISOString()*/ post.updatedAt ? finalupdateFormat : null}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}