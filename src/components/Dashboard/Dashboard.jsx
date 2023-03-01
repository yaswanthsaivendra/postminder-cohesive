import { Button, Card, Modal } from "flowbite-react";
import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { getAxios } from '../../scripts/sdk-client';
const axios = getAxios()

const Dashboard = ({ channels, setChannels, addedChannels,setAddedChannels}) => {
  const [show, setShow] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState({});
  const handleChange = (channel) => {
    setSelectedChannel(channel);
  };
  const addChannelForm = () => {
    console.log(selectedChannel);
    const sendSelectedChannel = async () => {
      const res = await axios.post(
        "/channels/",
        {
          title: selectedChannel.title,
          channel_pic: selectedChannel.channel_pic,
          channel_id: selectedChannel.id,
          description:selectedChannel.description
        }
      );
      if(res.status=201){
        
      const getAddedChannels = async () => {
        const res = await axios.get("/channels/");
        setAddedChannels(res.data);
        console.log(res);
      };
      getAddedChannels()
      const getChannels = async () => {
        const res = await axios.get("/youtube_auth/retrieveyoutubechannels/");
        setChannels(res.data.channels);
        console.log(res);
      };
      getChannels()
        setShow(false);
      }
      console.log(res);
    };
    sendSelectedChannel();
  };
  return (
    <>
      <h2 className="title">Channels</h2>
    
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {addedChannels.map((channel) => {
          return (
            <Link to={"/channel?channel="+channel.id}>
          <div className="rounded overflow-hidden shadow-lg">
            <img
              className="w-full"
              style={{height:"220px",objectFit:"cover"}}
              src={channel.channel_pic}
              alt={channel.title}
            />
            <div className="px-6 py-2" style={{height:"80px"}}>
              <div className="font-bold text-xl pt-2">{channel.title}</div>
              <p className="text-gray-700 text-base">{channel.description}</p>
            </div>
          </div>
            </Link>
           
            
          );
        })}
        <div className="rounded overflow-hidden shadow-lg">
          <img
            className="w-full"
            style={{height:"220px",objectFit:"cover"}}
            src="https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg"
            alt="Mountain"
          />
          <div className="px-6 py-4">
            <div className=" flex justify-end">
              <button
                type="button"
                className="text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                onClick={() => {
                  setShow(true);
                }}>
                Add a Youtube Channel
              </button>
            </div>
          </div>
        </div>

        {/* add a channel model */}
        <Modal
          show={show}
          dismissible={true}
          position="center"
          onClose={() => {
            setShow(!show);
          }}>
          {!successModal ? (
            <>
              <Modal.Header>Add Youtube Channel</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Connect with the YoutTube Channel linked with your Gmail
                    Account and get started
                  </p>
                  {channels.length==0?<p className="flex justify-center w-full p-5 text-l">You added all the channels linked to your account🎉</p>:<></>}
                  <ul>
                    {channels.map((channel) => {
                      return (
                        <>
                          <li className="m-2">
                            <input
                              type="radio"
                              id={channel.id}
                              name="channel_id"
                              value={channel.id}
                              className="hidden peer"
                              required
                              onChange={() => {
                                handleChange(channel);
                              }}
                            />
                            <label
                              htmlFor={channel.id}
                              className="inline-flex items-center justify-between w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                              <div className="block flex justify-center items-center">
                                <img
                                  className="w-10 h-10 rounded-full mx-2"
                                  src={channel.channel_pic}
                                  alt="Rounded avatar"
                                  referrerpolicy="no-referrer"
                                />
                                <div className="w-full">{channel.title}</div>
                              </div>
                            </label>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  // onClick={() => {
                  //   setSuccessModal(true);
                  // }}
                  onClick={addChannelForm}>
                  Add
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setShow(!show);
                  }}>
                  Close
                </Button>
              </Modal.Footer>{" "}
            </>
          ) : (
            <>
              <Modal.Header>
                <div className="space-y-6">
                  <div className="w-20 h-20 rounded-full  m-4 p-2 flex items-center justify-center mx-auto mb-3.5">
                    <img
                      src="https://s3-alpha-sig.figma.com/img/06d0/bb60/59d8252de17f3a4a1952c0e8e5e20d63?Expires=1676246400&Signature=qc2whb6lcoWtQ6wSTIGG7vY77SPlbfzxCVoFHgjUIhDu7rFwg8HFQjO8ImbgZA-kVMYahULXbegGCtretyewuR3wAsE7rwNeTl~zZm0gN10fKSGhJanOZ2nr4LLQBaC~ZBbUYhd4Fb-4b8HrpljfwkBWeNukZ~OaKVeX7VVQtotJVvxn3fwrrcjez4o~SNgg1UBO9UZMv6tWWGP0ocpjOP~kpkiNnEixIhweTMkE5tq8AUG4gCWHdMc9yBDnYjvAvGW6RR2oM0fHmM4AuXV17uiK8R3atRrVKLJ2JhA-jkKRcR949f2WHcjRcMo6H4K9dThvGdNmryDeAztnYzzvfA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
                      alt="partypopper"
                    />
                    <span className="sr-only">Success</span>
                  </div>
                  <div className="flex justify-center ">
                    <h1 className="text-2xl font-semibold text-gray-900 text-center">
                      Congratulations!
                    </h1>
                  </div>
                  <div className="flex justify-center pb-5">
                    <h1 className="text-gray-500 dark:text-white text-center">
                      Your account has been successfully linked with PostMinder.
                      Let’s go!
                    </h1>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Footer className="flex justify-center p-2 ">
                <Button
                  onClick={() => {
                    setSuccessModal(true);
                  }}
                  size="xl">
                  Continue
                </Button>
              </Modal.Footer>{" "}
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
