

export default function NameSearch({setSearchedPostName}) {

    

    return (
        <>
            <div className='searchbar'>
                <input type="text" placeholder="Search by name" onChange={(e) => setSearchedPostName(e.target.value)} />
            </div>
        </>
    )



}