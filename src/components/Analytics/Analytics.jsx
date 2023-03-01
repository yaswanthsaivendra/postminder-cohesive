import { useEffect, useState } from "react";
import { BsFillClockFill } from "react-icons/bs";
import { getAxios } from '../../scripts/sdk-client';
const axios = getAxios()

const Analytics = ({ addedChannels,authorized }) => {
  const [channelDetails, setChannelDetails] = useState([]);
  const [option, setOption] = useState(1);
  const [overallAnalytics, setOverallAnalytics] = useState([]);

  useEffect(() => {
    addedChannels.map((channel) => {
      const getChannelAnalytics = async () => {
        const res = await axios.get(
          `/channel_analytics/${channel.id}/`
        );
        console.log(res);
        res.data.title = channel.title;
        setChannelDetails((prevState) => [...prevState, res.data]);
      };
      getChannelAnalytics();
    });

    const getOverallAnalytics = async () => {
      const res = await axios.get(`/overall_analytics/`);
      console.log(res);
      setOverallAnalytics(res.data);
    };
    getOverallAnalytics();

  }, [addedChannels, option]);
  return (
    <>{authorized?<> <>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 ">Analytics</h1>
      <div className="flex flex-wrap items-center">
        <div
          class="px-5 py-4 m-3 border font-medium rounded"
          style={{ minWidth: "200px" }}>
          <h1 className="mb-1 text-lg text-gray-500 ">Views</h1>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 ">
            {overallAnalytics[0]?.views}
          </h1>
        </div>
        <div
          class="px-5 py-4 m-3 border font-medium rounded"
          style={{ minWidth: "200px" }}>
          <h1 className="mb-1 text-lg text-gray-500 ">Subscribers</h1>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 ">
            {overallAnalytics[0]?.subscribersGained}
          </h1>
        </div>
        <div
          class="px-5 py-4 m-3 border font-medium rounded"
          style={{ minWidth: "200px" }}>
          <h1 className="mb-1 text-lg text-gray-500 ">Number of videos</h1>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 ">
            {overallAnalytics[0]?.videos}
          </h1>
        </div>
      </div>
      <div class="relative overflow-x-auto my-5">
        <h1 className="m-4 text-2xl font-semibold text-gray-900">Numbers</h1>
        <div className=" border border-gray rounded-lg shadow m-1">
          <div className="flex items-center justify-between p-2">
            <h6 className="text-lg text-gray-900 mx-5 fond-semibold">
              Youtube channels overview
            </h6>
            {/* <button className="border px-3 py-2 mx-2 rounded-lg flex items-center"> <BsFillClockFill className="text-gray-500"/> <p className="px-2">Last 30 days</p></button> */}
            <select
              id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-2 mx-2 ml-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="type"
              onChange={(e) => {
                setOption(Number(e.target.value));
                setChannelDetails([]);
              }}>
              <option selected value="1">
                Last 30 days
              </option>
              <option value="2">Last 60 days</option>
              <option value="3">This Year</option>
            </select>
          </div>

          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-gray-500">
                <th scope="col" class="px-6 py-3">
                  Channel Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Total Views
                </th>
                <th scope="col" class="px-6 py-3">
                  Subscribers
                </th>
                <th scope="col" class="px-6 py-3">
                  Impressions
                </th>
              </tr>
            </thead>
            <tbody>
              {channelDetails.map((channel) => {
                return (
                  <tr
                    class="bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    key={channel.title}>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {channel.title}
                    </th>
                    <td class="px-6 py-4">{channel.views}</td>
                    <td class="px-6 py-4">{channel.subscribersGained}</td>
                    <td class="px-6 py-4">{channel.impressions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </></>:<>
    <p className="text-gray-700">Please add channels</p>
    </>}</>
   
  );
};
export default Analytics;
