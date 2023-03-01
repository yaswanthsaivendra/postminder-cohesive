import banner from '../../images/banner.png'
const Integrations = () =>{
    return(
        <>
        <div className="w-100 flex justify-center items-center " style={{height:'80vh'}}>
            <div className='flex items-center justify-center w-100 flex-col mr-5 pr-5'>
            <img src={banner} alt="" />
              <h4 className='text-center my-2'>Exciting Features Coming Soon. Stay Tuned!</h4>
              <button className='text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-3 '>Get Notifications</button>
            </div>
        </div>
        </>
    )
}
export default Integrations