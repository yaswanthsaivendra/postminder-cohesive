const AuthPage = ({auth_url})=>{


  // const authfunction = () => {
  //   window.open(auth_url);
  // }



    return(
        <>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">Channels</h1>

        <div className="rounded overflow-hidden shadow-lg mt-3 " style={{width:'400px'}}>
          <img
            className="w-full"
            style={{height:"220px",objectFit:"cover"}}
            src="https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg"
            alt="Mountain"
          />
          <div className="px-6 py-4">
            <div className=" flex justify-end">
                <a href={auth_url} target="_blank">
                <button
                type="button"
                className="text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                Add a Youtube Channel
              </button>
              {/* <button onClick={() => authfunction()}>click</button> */}
                </a>
              
            </div>
          </div>
        </div>
        </>
    )
}
export default AuthPage