import {
  Button,
  Checkbox,
  Dropdown,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { useDropzone } from "react-dropzone";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import { InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";
import { FaDropbox, FaGoogleDrive } from "react-icons/fa";
import { height } from "@mui/system";
import { BsPlusCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getAxios } from '../../scripts/sdk-client';
const axios = getAxios()

const ScheduleMultipleModal = ({
  scheduleMultipleModalShow,
  setScheduleMultipleModalShow,
  addedChannels,
}) => {
  const [paths, setPaths] = useState([]);
  const [formDetails, setFormDetails] = useState({});
  const [detailsArray, setDetailsArray] = useState([{}]);
  const [value, setValue] = useState(new Date());
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    if (detailsArray[id]) {
      const newArray = detailsArray.map((c, i) => {
        if (i === id) {
          return formDetails;
        } else {
          return c;
        }
      });
      setDetailsArray(newArray);
    } else {
      // all other objects
      setDetailsArray((values) => [...values, formDetails]);
    }
  });
  // on drop fxn
  const onDrop = useCallback(
    (acceptedFiles) => {
      setPaths(
        acceptedFiles.map((file) => {
          URL.createObjectURL(file);
          const reader = new FileReader();

          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");
          reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            // setFormDetails

            setFormDetails((values) => ({ ...values, video: binaryStr }));
          };
          reader.readAsArrayBuffer(file);
        })
      );
    },
    [setPaths]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "video/*": [
        ".mp4",
        ".MOV",
        ".mpeg",
        ".mpeg2",
        ".mpeg4",
        ".mpg",
        ".avi",
        ".flv",
        ".wmv"
      ],
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  //handle change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormDetails((values) => ({ ...values, [name]: value }));
  };
  const nextClick = () => {
    if (detailsArray[id]) {
      const newArray = detailsArray.map((c, i) => {
        if (i === id) {
          return formDetails;
        } else {
          return c;
        }
      });
      setDetailsArray(newArray);
    } else {
      setDetailsArray((values) => [...values, formDetails]);
    }
  };
  const anotherOne = (currentId) => {
    //for the past id object
    if (detailsArray[id]) {
      const newArray = detailsArray.map((c, i) => {
        if (i === id) {
          return formDetails;
        } else {
          return c;
        }
      });
      setDetailsArray(newArray);
    } else {
      // all other objects
      setDetailsArray((values) => [...values, formDetails]);
    }
    setId(currentId);
    setFormDetails(detailsArray[currentId]);
  };

  //on submit
  const submitMultiplePosts = () => {
    setLoading(true);
    const submitPostAsync = async (formDetails, index) => {
      let keywords = formDetails.keywords.split(",");
      let channelId;
      if (!formDetails.channel_id) {
        channelId = addedChannels[0].id;
      }

      const res = await axios.post(
        "/posts/",
        {
         

          channel:channelId,
          title: formDetails.videoTitle,
          description: formDetails.description,
          thumbnail:formDetails.thumbnail,
          video:formDetails.video,
          scheduled_at: formDetails.date,
          category_id: 1,
          upload_status: "SCHEDULED",
          tags: keywords,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
        },
      }
      );

      console.log(res);
      if(index == detailsArray.length - 1) {
        setScheduleMultipleModalShow(false);
        navigate(`/`, { replace: true });
        setLoading(false);
      }

    };
    detailsArray.map((formDetails, index) => {
      submitPostAsync(formDetails, index);
      console.log(formDetails);
    });
    // window.location.reload(false);

  };

  // draft
  const draftMultiplePosts = () => {
    setLoading(true);
    const submitPostAsync = async (formDetails, index) => {
      let keywords = formDetails.keywords.split(",");
      let channelId;
      if (!formDetails.channel_id) {
        channelId = addedChannels[0].id;
      }

      const res = await axios.post(
        "/posts/",
        {
         

          channel:channelId,
          title: formDetails.videoTitle,
          description: formDetails.description,
          thumbnail:formDetails.thumbnail,
          video:formDetails.video,
          scheduled_at: formDetails.date,
          category_id: 1,
          upload_status: "DRAFT",
          tags: keywords,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
        },
      }
      );

      console.log(res);
      if(index == detailsArray.length - 1) {
        setScheduleMultipleModalShow(false);
        navigate(`/`, { replace: true });
        setLoading(false);
      }
    };
    detailsArray.map((formDetails, index) => {
      submitPostAsync(formDetails, index);
      console.log(formDetails);
    });
    // window.location.reload(false);
  };
  return (
    <Modal
      show={scheduleMultipleModalShow}
      popup={true}
      size="5xl"
      position="center"
      onClose={() => {
        setScheduleMultipleModalShow(false);
      }}>
      <Modal.Header>
        <div className="p-5"> Schedule Multiple Posts</div>
      </Modal.Header>
      <hr />

      <Modal.Body>
        <div style={{ maxHeight: "70vh", overflowY: "scroll" }}>
          <div className="flex ">
            {/* <div className="border-2 divide-dashed p-2 m-2 flex items-center justify-center" style={{width:"150px",height:"150px",cursor:"pointer"}} onClick={() =>setId(0)}>
                  0
                  </div> */}
            {detailsArray.map((details, index) => {
              return (
                <>
                {id==index?<>
                  <div
                  className="border-2 border-blue-600 divide-dashed p-2 m-2 flex items-center justify-center rounded"
                  style={{ width: "150px", height: "150px", cursor: "pointer" }}
                  onClick={() => {
                    anotherOne(index);
                  }}>
                  <p className="text-gray-500">
                  Media

                  </p>
                </div>
                </>:<>
                <div
                  className="border-2  divide-dashed p-2 m-2 flex items-center justify-center rounded"
                  style={{ width: "150px", height: "150px", cursor: "pointer" }}
                  onClick={() => {
                    anotherOne(index);
                  }}>
                  <p className="text-gray-500">
                  Media

                  </p>
                </div>
                </>}
               
                </>
               
              );
            })}
            <div
              className="border-2 divide-dashed p-2 m-2 flex items-center justify-center "
              style={{
                width: "150px",
                height: "150px",
                borderStyle: "dashed",
                cursor: "pointer",
              }}
              onClick={() => {
                setDetailsArray((values) => [...values, {}]);
              }}>
              <BsPlusCircleFill
                className=" text-gray-400"
                style={{ fontSize: "55px" }}
              />
            </div>
          </div>
          <div className="space-y-6 px-1 py-3">
            <div className="flex flex-wrap">
              <div className="px-4" style={{ minWidth: "400px", width: "50%" }}>
                <section className="container">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <div class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mt-5">
                      <div
                        class="flex flex-col items-center justify-center pt-5 pb-6"
                        id="imgPreview">
                        {paths.length == 0 ? (
                          <>
                            <svg
                              aria-hidden="true"
                              class="w-10 h-10 mb-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span class="font-semibold">Click to upload</span>{" "}
                              or drag and drop
                            </p>
                            {/* <p class="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p> */}
                          </>
                        ) : (
                          <>
                            {paths.map((path) => {
                              return (
                                <>
                                  {/* <img
                                  key={path}
                                  src={path}
                                  className="h-60 w-80"
                                  style={{ objectFit: "cover" }}
                                /> */}
                                  <aside className="p-2">
                                    {files.length > 0 ? (
                                      <>
                                        <h4>Selected Files</h4>
                                        <ul>{files}</ul>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </aside>
                                </>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                <div className="flex justify-between">
                  {/* <div class="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  block my-2  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-tl rounded-bl">
                      <FaDropbox className="text-gray-700 text-xl" />
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  block my-2  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2 rounded-tr rounded-br border-l-0">
                      <FaGoogleDrive className="text-gray-700 text-xl" />
                    </button>
                  </div> */}
                  <div className="flex">
                    <select
                      id="type"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-2 mx-1 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="type"
                      onChange={handleChange}>
                      <option selected value="video">
                        Video
                      </option>
                      {/* <option value="photo">Photo</option> */}
                    </select>

                    <select
                      id="channel"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block my-2 mx-1 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="channel"
                      onChange={() => {}}>
                      {addedChannels?.map((channel, id) => {
                        return (
                          <>
                            {id == 0 ? (
                              <option selected value={channel.channel_id}>
                                {channel.title}
                              </option>
                            ) : (
                              <option value={channel.channel_id}>
                                {channel.title}
                              </option>
                            )}
                          </>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-4"
                  for="file_input">
                  Choose a thumbnail for the video
                </label>
                <input
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  name="thumbnail"
                  accept="image/png, image/gif, image/jpeg,image/jpg,image/bmp,image/webp"
                  onChange={(e) => {
                    setFormDetails((values) => ({
                      ...values,
                      thumbnail: e.target.files[0],
                    }));
                  }}
                />
              </div>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <form className="flex flex-col gap-4 w-full p-2">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="videoTitle" value="Title for the Video" />
                    </div>
                    <input
                      type="text"
                      id="videoTitle"
                      name="videoTitle"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Add the title for the video"
                      required
                      value={formDetails.videoTitle || ""}
                      onChange={handleChange}></input>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="keywords"
                        value="Keywords for the Video"
                      />
                    </div>
                    <input
                      type="text"
                      id="keywords"
                      name="keywords"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Add the keywords for the video"
                      required
                      value={formDetails.keywords || ""}
                      onChange={handleChange}></input>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="description"
                        value="Description for the Video"
                      />
                    </div>
                    <textarea
                      id="message"
                      rows="4"
                      name="description"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="add description..."
                      onChange={handleChange}
                      value={formDetails.description || ""}></textarea>
                  </div>
                  <div className="block">
                    <Label htmlFor="keywords" value="Date and time to post" />
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      value={value}
                      className="bg-gray-50"
                      onChange={(newValue) => {
                        setValue(newValue)
                        setFormDetails((values) => ({
                          ...values,
                          date: newValue.$d,
                        }));
                      }}
                    />
                  </LocalizationProvider>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <hr />
      <div className="flex p-3 justify-end">
        {!loading?<><button
          type="button"
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          onClick={draftMultiplePosts}>
          Save as Draft
        </button>
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-3"
          onClick={() => {
            submitMultiplePosts();
          }}>
          Schedule
        </button></>:<> <div role="status" className="flex items-center">
    <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <p className="text-gray-700 p-2">Uploading...</p>
    
    <span class="sr-only">Loading...</span>
</div></>}
       

      </div>
    </Modal>
  );
};
export default ScheduleMultipleModal;
