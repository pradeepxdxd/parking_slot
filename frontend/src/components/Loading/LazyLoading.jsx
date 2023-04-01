import Spinner from 'react-bootstrap/Spinner'

function LazyLoading () {
  return(
    <>
    <div className='mb-3' style={{display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh", marginRight:"2px"}}>
      <Spinner animation="grow" />
      <Spinner animation="grow" />
      <Spinner animation="grow" />
    </div>
    </>
  )
}

export default LazyLoading
