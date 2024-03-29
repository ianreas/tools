//this page does dynamic routing - there can be anything in [slug], so www.url.com/admin/anything
//we can extract this 'anything' string from the url and use it to fetch the data from firebase

import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import ImageUploader from '../../components/ImageUploader.js';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

import "react-datepicker/dist/react-datepicker.css";

import DatePicker from "react-datepicker"

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import {GoogleMap, useLoadScript, Marker} from '@react-google-maps/api'

import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css"

import usePlacesAutocomplete, {
  getGeocode, 
  getLatLng
} from 'use-places-autocomplete'



export default function AdminPostEdit(props) {  //PostManager is wrapped in authcheck so Postmanager is only rendered if the user is signed in
  return (
    <AuthCheck>  
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);      //there is preview mode so we set the state for that

  

  const router = useRouter();           //use router to grab the slug from the url parameters
  const { slug } = router.query;

  // const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
  const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug)      //refencing path to the post document
  const [post] = useDocumentDataOnce(postRef);  //useDocumentDataOnce is from the react firebase hooks                                         

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section >
            <h1 className={styles.posthead}>{post.title}</h1>
            <p className={styles.posthead}>ID: {post.slug}</p>
           

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3 id="tools" style={{color: "white"}}>Tools</h3>
            <button onClick={() => setPreview(!preview)} className="btn-blue">{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

const PlacesAutocomplete = ({ setSelected, setAddress }) => {
  const {
    ready, 
    value, //what users typed in the input box
    setValue, 
    suggestions: {status, data}, 
    clearSuggestions, //its a function that we call when the user has chosen a specific suggestion
  } = usePlacesAutocomplete()

  const handleSelect = async (address) => { //address is chosen address by the user
    setValue(address, false); //we change the value of value variable (so far its just what user has typed) to the selected suggestion address
    clearSuggestions();

    const results = await getGeocode({address})
    console.log(address)
    
    
    const {lat, lng} = await getLatLng(results[0])
    setAddress(address)
    console.log(address)
    setSelected({lat, lng}) //setSelected is from the Map component and it is center of the ma
  }

  return (
  <Combobox onSelect={handleSelect}>
    <ComboboxInput style={{padding: '5px', borderRadius: '5px'}} value={value} onChange={(e)=> setValue(e.target.value)} disabled={!ready} 
    className = 'combobox-input' placeholder='search an address'/>
    <ComboboxPopover>
      <ComboboxList>
        {status === 'OK' && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description} />)}
      </ComboboxList>
    </ComboboxPopover>
  </Combobox>
  )
}

function Map({onButtonClick, onChooseLat}){
  const [selected, setSelected] = useState(null)

  const [address, setAddress] = useState(null)

  const handleClick = () => {
    onButtonClick(address)
    onChooseLat(selected)
  }





  const center = useMemo((selected) => (selected), [selected]) //to make sure the map wont recenter itself after every rerender we use Usememo hook
  //useMemo will only memorize center variable and will recalculate enter only if the array argument changes

  console.log(address + "hehe")

  return <>
  <div className='places-container'><PlacesAutocomplete setSelected={setSelected} setAddress={setAddress}/></div>
  <div>
    <button onClick={handleClick}>Submit your address</button>
  </div>
  <GoogleMap zoom={10} center={selected} mapContainerClassName='map-container' >{selected && <Marker position={selected}/>}</GoogleMap>
  
  <div></div>
  </>
}




function PostForm({ defaultValues, postRef, preview }) {
  //maps load
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBE7TuDTklEU_1dYRFQnupMfHED2ykinVc",
    libraries: ['places']
  })
  
  //if (!isLoaded) return <div>Loading</div>

 
  const [newaddress, setNewAddress] = useState(null)

  const [coordinatess, setCoordinates] = useState(null)

  const chooseNewAddress = (address) => {
    setNewAddress(address)
  }

  const chooseCoordinates = (selected) => {
    setCoordinates(selected)
  }



  const { register, handleSubmit, reset, watch, formState: { errors, isDirty, isValid } } = useForm({ defaultValues, mode: 'onChange' });  //mode onChange means everytime the value of the form changes its going to rerender the form also defaultValues is data from our firestore document 

  const [startDatee, setStartDate] = useState(new Date());

  const [exchangeFore, setExchangeFor] = useState('')

  const [endDatee, setEndDate] = useState(new Date())

  const handleChange = (event) => {
    setExchangeFor(event.target.value)
    console.log(exchangeFore)
  }

  console.log(newaddress + "inform")

  console.log(coordinatess)

  const [buying, setBuying] = useState("buying")

  const handleBuying = (event) => {
    setBuying(event.target.value)
  }

  const [displaybuying, setDisplayBuying] = useState(true)

  let buyingselling

  if (buying == "buying"){
    buyingselling = true
  } else {
    buyingselling = false
  }

  let isExchanging
  if (buying== 'exchanging'){
    isExchanging = true
  }
  else {
    isExchanging = false
  }

  const [pricee, setPrice] = useState(0)

  const handlePrice = (event) => {
    setPrice(event.target.value)
  }

  

  const updatePost = async ({ content, published, exchangeFor, startDate, endDate,address, coordinates, buyingselling, price}) => { //this function automatically has access to the values in the form, content and published
    await updateDoc(postRef, {                 //updateDoc sends the data to firestore
      content,
      published,
      exchangeFor: exchangeFore, 
      startDate: startDatee,
      endDate: endDatee,
      updatedAt: serverTimestamp(),
      address: {address: newaddress, coordinates : coordinatess},
      coordinates: coordinatess,
      buyingselling: buying,
      price: pricee,
    });

    reset({ content, exchangeFor, }); //reset the form after we submit it

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (                     
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown> {/*it watches the content of the post and renders it with the reactmarkddown component */}
        </div>
      )}
        {/*if we are not in preview mode - we are gonna show some controls*/}
      <div className={preview ? styles.hidden : styles.controls}>
      <div className='buysell'>
              <label for='buysell' style={{color: "white"}}>Are you buying or selling?</label>
              <select id='buysell' name='buysell' value={buying} onChange={handleBuying} style={{padding: '5px', borderRadius: '5px', border: '1px solid #ccc'}}>
                <option value='buying'>Buying</option>
                <option value='selling'>Selling</option>
                <option value='exchanging'>Exchanging</option>
              </select>
            </div>
        <ImageUploader postRef={postRef}/> {/*textarea is where users can write the post */}
        <div className='timeselect'>
              <div className='startdate'>
            {buyingselling ? <p>When do you want to pick it up?</p> : <p>When is your tool available for pickup?</p>}<DatePicker selected={startDatee} showTimeSelect onChange={(date) => setStartDate(date)} />
            </div>
            {isExchanging && <div className='enddate'>
              <p>When do you want it to be returned? (If you are exchanging it.) </p><DatePicker selected={endDatee} showTimeSelect onChange={(date) => setEndDate(date)} />
            </div>}
            </div>
            {isExchanging &&
            <div className='exchangefor'>
            <label for='exchangeitem'>What do you want it to exchange for? If nothing, then just type nothing:        </label>
              <input  style={{padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc'}} type='text' id='exchangeitem' name='exchangeitem' onChange={handleChange} value={exchangeFore} ></input>
            </div>
              }
              {!isExchanging && 
            <div className='price' style={{color: "white", marginTop: "5px"}}>
              
            {buyingselling ? <label for='price'>How much money do you want to buy it for?($)</label> : <label for='price'>How much money do you want to sell it for?($)</label>}
            <input style={{padding: '5px', borderRadius: '5px', border: '1px solid #ccc'}} type='number' id='price' name='price' onChange={handlePrice} ></input>
            
            </div>
                }
            
            <div className='locsearch'>
            
            {!isLoaded ? <div>Loading</div> : <Map onButtonClick={chooseNewAddress} onChooseLat={chooseCoordinates}/>}
            <div id='address'>Chosen address: </div> <div id='address'>{newaddress ? newaddress : <div></div>}</div>
            
           
            <div id="output"></div>
            </div>
        <textarea
          name="content"
          {...register("content", {
            maxLength: { value: 20000, message: 'content is too long' },
            
            required: { value: false, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset> {/*a checkbox where the user can decide to publish the post */}
          <input className={styles.checkbox} name="published" type="checkbox" {...register('published')} />
          <label className='isitpublished'>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/admin');
      toast('post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}
