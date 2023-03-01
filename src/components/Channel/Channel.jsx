import { Dropdown, Tabs } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsFillCalendarFill, BsFillClockFill } from "react-icons/bs";
import moment from "moment";
import { getAxios } from '../../scripts/sdk-client';
const axios = getAxios()

const Channel = ({authorized}) => {
  const [channelDetails, setChannelDetails] = useState({});
  const [option,setOption] = useState(1);
  const [posts,setPosts] = useState([]);
  const [queueCount,setQueueCount] =useState(0)
  const [draftCount,setDraftCount] =useState(0)
  const [liveCount,setLiveCount] =useState(0)
  
  
  


  
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const channel_id = queryParameters.get("channel");
    console.log(channel_id);
    const getChannelAnalytics = async () => {
      const res = await axios.get(`/channel_analytics/${channel_id}/`);
      console.log(res);
      setChannelDetails(res.data);
    };
    getChannelAnalytics();

    // get posts
    const getPosts = async () => {
      const res = await axios.get(`/channel_posts/${channel_id}/`);
      console.log(res);
      setPosts(res.data);
      // res.data.map((post)=>{
      //   if(post.upload_status=='SCHEDULED'){

      //   }
      // })

    };
    getPosts()
     
  }, [option]);
  return (
    <>
    {authorized?<>   <div>
    <div className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 ">
            {channelDetails.title}
          </h1>

          {/* <button className="border px-3 py-2 mx-2 rounded flex items-center">
            {" "}
            <BsFillClockFill className="text-gray-500" />{" "}
            <p className="px-2">Last 30 days</p>
          </button> */}
          {/* <select
            id="type"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-2 mx-2 ml-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="type"
            onChange={(e) => {setOption(Number(e.target.value))}}>
            <option selected value="1">
              Last 30 days
            </option>
            <option value="2">
              Last 60 days
            </option>
            <option value="3">This Year</option>
            
          </select> */}
        </div>

        <button class="border p-3 rounded hover:opacity-75 hover:shadow">
          Bulk Schedule
        </button>
      </div>

      <div className="flex flex-wrap items-center">
        <div
          class="px-5 py-4 m-3 border font-medium rounded"
          style={{ minWidth: "200px" }}>
          <h1 className="mb-1 text-lg text-gray-500 ">Views</h1>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 ">
            {channelDetails.views}
          </h1>
        </div>
        <div
          class="px-5 py-4 m-3 border font-medium rounded"
          style={{ minWidth: "200px" }}>
          <h1 className="mb-1 text-lg text-gray-500 ">Subscribers</h1>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 ">
            {channelDetails.subscribersGained}
          </h1>
        </div>
        <div
          class="px-5 py-4 m-3 border font-medium rounded"
          style={{ minWidth: "200px" }}>
          <h1 className="mb-1 text-lg text-gray-500 ">Impressions</h1>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 ">{channelDetails.impressions}</h1>
        </div>
      </div>
      <div className="mt-5 pt-5">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 ">
          Scheduled Uploads
        </h1>
        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item title="In Queue ">
           {posts.map((post)=>{
            return(
              <>
              {post.upload_status=='SCHEDULED'?<>
              <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-wrap my-3">
              <a href="#">
                <img
                  className="m-3 rounded-lg "
                  src={post.thumbnail}
                  alt=""
                  style={{
                    width: "250px",
                    minWidth: "200px",
                    maxHeight: "180px",
                  }}
                />
              </a>
              <div
                class="p-5 flex flex-col "
                style={{ width: "50%", minWidth: "280px" }}>
                <a href="#">
                  <h5 class="mb-2 text-lg font-medium tracking-tight text-gray-900 dark:text-white">
                    {post.title}
                  </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {post.description}
                 
                </p>
                <div class="flex items-center" style={{ maxWidth: "300px" }}>
                  <p className="text-gray-500">Scheduled by:</p>
                  <p class="font-normal text-gray-500 dark:text-gray-400 flex items-center p-2">
                    <img
                      class="w-8 h-8  rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="Rounded avatar"
                    />
                    <p className="px-2">{post.scheduled_by}</p>
                  </p>
                </div>
              </div>
              <div
                class="px-5 my-5 flex flex-col border-l justify-center"
                style={{ maxWidth: "300px" }}>
                <b>Scheduled at:</b>
                <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                  <div className="flex items-center ">
                    Time:
                    <BsFillClockFill className="text-gray-500 m-2" />
                    {moment(post.scheduled_at).format('h:mm a')}
                  </div>
                  <div className="flex items-center justify-center">
                    Date: <BsFillCalendarFill className="text-gray-500 m-2" />{" "}
                    {moment(post.scheduled_at).format('DD/MM/YYYY')}
                  </div>
                </p>
              </div>
            </div>

              </>:<></>}
              </>
            )
           })}
           
          </Tabs.Item>
          <Tabs.Item title="Drafts ">
          {posts.map((post)=>{
            return(
              <>
              {post.upload_status=='DRAFT'?<>
              <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-wrap my-3">
              <a href="#">
                <img
                  className="m-3 rounded-lg "
                  src={post.thumbnail}
                  alt=""
                  style={{
                    width: "250px",
                    minWidth: "200px",
                    maxHeight: "180px",
                  }}
                />
              </a>
              <div
                class="p-5 flex flex-col "
                style={{ width: "50%", minWidth: "280px" }}>
                <a href="#">
                  <h5 class="mb-2 text-lg font-medium tracking-tight text-gray-900 dark:text-white">
                    {post.title}
                  </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {post.description}
                </p>
                <div class="flex items-center" style={{ maxWidth: "300px" }}>
                  <p className="text-gray-500">Scheduled by:</p>
                  <p class="font-normal text-gray-500 dark:text-gray-400 flex items-center p-2">
                    <img
                      class="w-8 h-8  rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="Rounded avatar"
                    />
                    <p className="px-2">{post.scheduled_by}</p>
                  </p>
                </div>
              </div>
              <div
                class="px-5 my-5 flex flex-col border-l justify-center"
                style={{ maxWidth: "300px" }}>
                <b>Scheduled at:</b>
                <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                  <div className="flex items-center ">
                    Time:
                    <BsFillClockFill className="text-gray-500 m-2" />
                    {moment(post.scheduled_at).format('h:mm a')}
                  </div>
                  <div className="flex items-center justify-center">
                    Date: <BsFillCalendarFill className="text-gray-500 m-2" />{" "}
                    {moment(post.scheduled_at).format('DD/MM/YYYY')}
                  </div>
                </p>
              </div>
            </div>

              </>:<></>}
              </>
            )
           })}
          </Tabs.Item>
          <Tabs.Item title="Live">
          {posts.map((post)=>{
            return(
              <>
              {post.upload_status=='LIVE'?<>
              <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-wrap my-3">
              <a href="#">
                <img
                  className="m-3 rounded-lg "
                  src={post.thumbnail}
                  alt=""
                  style={{
                    width: "250px",
                    minWidth: "200px",
                    maxHeight: "180px",
                  }}
                />
              </a>
              <div
                class="p-5 flex flex-col "
                style={{ width: "50%", minWidth: "280px" }}>
                <a href="#">
                  <h5 class="mb-2 text-lg font-medium tracking-tight text-gray-900 dark:text-white">
                    {post.title}
                  </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {post.description}
                </p>
                <div class="flex items-center" style={{ maxWidth: "300px" }}>
                  <p className="text-gray-500">Scheduled by:</p>
                  <p class="font-normal text-gray-500 dark:text-gray-400 flex items-center p-2">
                    <img
                      class="w-8 h-8  rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="Rounded avatar"
                    />
                    <p className="px-2">{post.scheduled_by} </p>
                  </p>
                </div>
              </div>
              <div
                class="px-5 my-5 flex flex-col border-l justify-center"
                style={{ maxWidth: "300px" }}>
                <b>Scheduled at:</b>
                <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                  <div className="flex items-center ">
                    Time:
                    <BsFillClockFill className="text-gray-500 m-2" />
                    {moment(post.scheduled_at).format('h:mm a')}
                  </div>
                  <div className="flex items-center justify-center">
                    Date: <BsFillCalendarFill className="text-gray-500 m-2" />{" "}
                    {moment(post.scheduled_at).format('DD/MM/YYYY')}
                  </div>
                </p>
              </div>
            </div>

              </>:<></>}
              </>
            )
           })}
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
    </>:<>
    <p className="text-secondary">Please add channels</p>
    
    </>}
 
    </>
  );
};
export default Channel;
