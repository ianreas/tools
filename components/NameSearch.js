

export default function NameSearch({setSearchedPostName}) {

    

    return (
        <>
            <div className='searchbarfilter'>
                <input type="text" style={{padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc'}} placeholder="Search by name" onChange={(e) => setSearchedPostName(e.target.value)} />
            </div>
        </>
    )



}