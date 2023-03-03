//components directory will have all the reusable components

export default function Loader({show}){  //when show is true the component will be true
    return show ? <div className='loader'></div> : null //if true show the div otherwise show null
}