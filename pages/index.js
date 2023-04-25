import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { initializeApp } from 'firebase/app';
import Link from 'next/link'
import Loader from "../components/Loader"
import toast from 'react-hot-toast'

import { Timestamp, query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';
import { firestore, postToJSON } from '../lib/firebase';
import { useEffect, useState } from 'react';
import Metatags from '../components/Metatags';
import PostFeed from '../components/PostFeed'
import LocationSearch from '../components/LocationSearch'
import FilterToggle from '../components/FilterToggle'
import Script from "next/script"

const LIMIT = 12;

export async function getServerSideProps(context) {
  // const postsQuery = firestore
  //   .collectionGroup('posts')
  //   .where('published', '==', true)
  //   .orderBy('createdAt', 'desc')
  //   .limit(LIMIT);
  const ref = collectionGroup(getFirestore(), 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  console.log(posts)
 
  return {
    props: { posts: JSON.parse(JSON.stringify(posts)) }, // will be passed to the page component as props
  };
}

const inter = Inter({ subsets: ['latin'] })

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);  //we set props as state
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  console.log(posts)


  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    // const query = firestore
    //   .collectionGroup('posts')
    //   .where('published', '==', true)
    //   .orderBy('createdAt', 'desc')
    //   .startAfter(cursor)
    //   .limit(LIMIT);

      const ref = collectionGroup(getFirestore(), 'posts');
      const postsQuery = query(
        ref,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(cursor), //same thing as the other query but it starts after end of the last one
        limit(LIMIT),
      )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    console.log(posts)
    setLoading(false);

    if (newPosts.length < LIMIT) {   //Pagination
      setPostsEnd(true);
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const [youraddress, setYourAddress] = useState(null)

  const [coordinates, setCoordinates] = useState(null)

  const [searchedPostName, setSearchedPostName] = useState(null)

  const chooseYourAddress = (address) => {
    setYourAddress(address)
  }

  const chooseCoordinates = (coordinates) => {
    setCoordinates(coordinates)
  }

  console.log(youraddress)
  console.log(coordinates)

  const choosePostsbyName = (searchedPostName) => {
      setSearchedPostName(searchedPostName)
  }

  

  function sortByProximity(posts,coordinates) {
    // First, convert the user-given address into latitude and longitude coordinates
    // ...
    console.log(coordinates)
  
    // Then, for each post, calculate the distance between the user-given coordinates and the post's coordinates
    posts.forEach(post => {
      if(post.address?.coordinates){
      post.distance = haversine(coordinates, post.address?.coordinates);
      }
      
    });
  
    // Finally, sort the posts based on the calculated distances
    return posts.sort((a, b) => a.distance - b.distance);
  }


  
  function haversine(coord1, coord2) {
     console.log(coord1)
    const RADIUS = 6371; // Earth's radius in km
    const lat1 = coord1.lat * Math.PI / 180;
    const lat2 = coord2.lat * Math.PI / 180;
    const deltaLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const deltaLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return RADIUS * c; 
  }
  if (coordinates){
  sortByProximity(posts, coordinates)
  console.log(posts)
  }

 /*  function sortByName(posts,searchedPostName) {
    const filtered = posts.filter(post => post.title.toLowerCase().includes(searchedPostName.toLowerCase()))
    return filtered
  }
  if (searchedPostName){
    setPosts(sortByName(posts, searchedPostName));
  } */

  useEffect(()=> {
    if (searchedPostName){
    const filtered = posts.filter(post => post.title.toLowerCase().includes(searchedPostName.toLowerCase()))

    setPosts(filtered)
    }
  }, [searchedPostName])


  function clearFilters(){
    setYourAddress(null)
    setCoordinates(null)
    setSearchedPostName(null)
    setPosts(props.posts)
  }

  const [buyFilter, setBuyFilter] = useState('')

  console.log(buyFilter) //return null when i choose a filter

  const handleBuyFilterChange = (filter) => {
    setBuyFilter(filter)
    console.log(filter + 'filter')
  }

  /*  */

  useEffect(()=> {
    if (buyFilter===''){
      setPosts(props.posts)
    }
    else if (buyFilter==='buying'){
      const filtered = posts.filter(post => post.buyingselling === 'buying')
      setPosts(filtered)
    }
    else if (buyFilter==='selling'){
      const filtered = posts.filter(post => post.buyingselling === 'selling')
      setPosts(filtered)
    }
    else if (buyFilter==='borrowing'){
      const filtered = posts.filter(post => post.buyingselling === 'borrowing')
      setPosts(filtered)
    }


  }, [buyFilter])

  


  return (
    <main>
      <Metatags title="Home Page" description="Get the latest posts on our site" />

      <div className="card card-info">
        <h2><span class='magic'><span class="magic-star">
      <svg viewBox="0 0 512 512">
      <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
      </svg>
    </span>
    <span class="magic-star">
      <svg viewBox="0 0 512 512">
      <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
      </svg>
    </span>
    <span class="magic-star">
      <svg viewBox="0 0 512 512">
      <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
      </svg>
    </span>
    <span class='magic-text'>Sell, buy and exchange your tools.</span></span> </h2>
        <p>Welcome! I am Ian. Here, you can buy, sell and exchange common household tools in your area!</p>
        <p>Sign up for an account, ✍️ write posts, then 💞 heart the tools you want to buy. </p>
      </div>

      <div className='filters'>
      {/* <button onClick={() => setShowPopup(true)} className='showfilters'> Show Filters</button> */}
      {//showPopup && (
        <FilterToggle 
          //closePopup={() => setShowPopup(false)} 
          onButtonClick={chooseYourAddress}
          onChooseLat={chooseCoordinates}
          onButtonNameClick={choosePostsbyName}
          onFilterChange={handleBuyFilterChange}
          setSelectedOption={setBuyFilter}
          selectedOption={buyFilter}
        />
      //)
    }
    <div className='clearfilters'>
    <button onClick={clearFilters} >Clear Filters</button>
    </div>
      
      
    </div>
    
    <div className="locationbox"></div>
     <div className='thefeed'>
      <PostFeed posts={posts} />
      </div>

      {!loading && !postsEnd && <button className="btn-red" onClick={getMorePosts}>Load more posts</button>} 

      <Loader show={loading} />

      {postsEnd && <p style={{color: 'white'}}>'You have reached the end!'</p>}
    </main>
  );
}
