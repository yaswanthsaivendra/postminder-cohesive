import { Modal } from "flowbite-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAxiosForPostminder } from "../../scripts/post-minder-axios";
const axios = getAxiosForPostminder();

const Callback = ({ setAuthorized }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const sendCode = async () => {
      const res = await axios.post("/youtube_auth/oauth2callback/", {
        url: window.location.href,
      });

      console.log(res);
      if (res.status === 201) {
        console.log("set authorized to true");
      }
    };
    sendCode();
  }, []);

  return (
    <>
      <Modal
        show="true"
        onClose={() => {
          setAuthorized(true);
          navigate("/", { replace: true });
        }}
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 py-5">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={() => {
              setAuthorized(true);
              navigate("/", { replace: true });
            }}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <h1 className=" p-1" style={{ fontSize: "60px" }}>
              🎉
            </h1>
            <h3 className="mb-5 text-3xl text-center font-normal ">
              Congratulations!
            </h3>
            <p className="texxt-gray-500 p-2">
              Your account has been successfully linked with Postminder.
            </p>

            <button
            //   data-modal-hide="popup-modal"
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 flex justify-center items-center my-2"
              style={{ width: "200px" }}
              onClick={() => {
                setAuthorized(true);
                navigate("/", { replace: true });
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Callback;
