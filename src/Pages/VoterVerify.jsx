// @ts-nocheck
import React, { useEffect, useState, Fragment } from "react";

import Webcam from "react-webcam";
import Candidate from "../Components/Candidate";
import sleep from "../Util/sleep";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Dialog, Transition, Listbox } from "@headlessui/react";

import { AiOutlineRight, AiOutlineInfoCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import CountdownProgressbar from "../Components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Lottie from "lottie-react";

import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../context/userContext";
import { useVerifiedContext } from "../context/verifiedContext";
const videoConstraints = {
  width: 220,
  height: 200,
  // facingMode: { exact: "environment" },
  facingMode: "user",
};

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const messages = ["Analyzing Faces...", "Matching with other users..."];

const VoterVerify = () => {
  const { verified, setVerified } = useVerifiedContext();
  const { user } = useUserContext();
  const webcamRef = React.useRef(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loadingText, setLoadingText] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const [analyze, setAnalyze] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const capturedImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCurrentImage(imageSrc);
  };

  const send = () => {
    //   Send these images to the flask api endpoint and get the response
    //   If the response is success, navigate to the voting section
    //   Else, show an error message
    setAnalyze(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

    const obj = {
      file: currentImage,
      id: user?.uid,
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
    };

    // console.log('Voter', 'VoterVerify');

    fetch("https://voting.prometeo.in/test", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);

        setAnalyze(false);
        if (result["is_matched"]) {
          setShowTick(true);
          setVerified(true);
          setTimeout(() => {
            navigate("/voter");
          }, 5900);
        } else {
          if (!result["face_found_in_image"]) {
            toast("Face not found!", { autoClose: 3000, type: "error" });
            setError("Face not Found!");
          } else {
            // console.log('match is false');
            toast("User Biometric failed", { autoClose: 3000, type: "error" });
            setError("User Biometric failed");
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  const AnalyzeImage = () => {
    useEffect(() => {
      let id = setInterval(() => {
        const idx = loadingText === 0 ? 1 : 0;
        setLoadingText(idx);
      }, 2000);

      return () => {
        clearInterval(id);
      };
    }, []);

    return (
      <div className="h-screen bg-[#eaedf1] flex flex-col justify-center items-center ">
        <img
          className="w-[300px] h-[300px] object-contain "
          src={require("../Images/analyze.gif")}
          alt=""
        />
        <p className="font-bold text-2xl tracking-wide ">
          {messages[loadingText]}
        </p>
      </div>
    );
  };

  if (analyze) {
    return <AnalyzeImage />;
  }

  if (showTick) {
    return (
      <div className="h-screen bg-white flex flex-col justify-center items-center ">
        <Lottie
          animationData={require("../Images/check.json")}
          style={{
            width: "300px",
            height: "300px",
          }}
        />
      </div>
    );
  }

  const InstructionModal = () => {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-1 min-h-screen w-full"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen w-full  px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-out duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl font-[Roboto">
                <div className="flex flex-col space-y-5  ">
                  <p className="text-4xl font-bold self-center ">
                    General Instructions
                  </p>
                  <div className="flex space-x-4 text-gray-600 ">
                    <span>1.</span>
                    <p className="text-md text-justify  ">
                      For the best and smooth voting experience, it is
                      recommended to use the latest version of the Google
                      chrome. In case of any issue, you can mail us at
                      support@iitj.ac.in.
                    </p>
                  </div>
                  <div className="flex space-x-4 text-gray-600 ">
                    <span>2.</span>
                    <p className="text-md text-justify  ">
                      Ensure that you are in a well lit room and your face is
                      always clearly visible. If you are not able to verify your
                      face, please try again atleast once.
                    </p>
                  </div>
                  <div className="flex space-x-4 text-gray-600 ">
                    <span>3.</span>
                    <p className="text-md text-justify  ">
                      This voting process will be proctored. Any kind of
                      malpractice will lead to some disciplinary action.
                    </p>
                  </div>
                  <div className="flex space-x-4 text-gray-600 ">
                    <span>4.</span>
                    <p className="text-md text-justify  ">
                      The voting screen has a 1 minute session time. Ensure you
                      submit your votes before the timer expires else you will
                      have to do re-verification.
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <button
                      className=" bg-primary text-lg text-white font-bold px-4 py-2 rounded-lg shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] flex flex-col justify-center items-center font-[Roboto] px-4 ">
      <InstructionModal />
      <div className="mb-5  flex items-center space-x-4 bg-orange-100 border border-orange-400 md:w-4/5 py-4 px-5 md:py-2 md:px-3  text-gray-400 rounded ">
        <AiOutlineInfoCircle className="text-2xl md:text-3xl text-orange-400 " />
        <div className="text-base md:text-sm ">
          <p>
            For best results, ensure you are in a well lit room. When taking a
            picture, look straight for 4 sec.
          </p>
        </div>
      </div>
      <div className="flex items-center mt-4 md:flex-col  ">
        <div className="bg-white rounded-md md:mb-5 shadow shadow-teal-100 p-6 ">
          {currentImage ? (
            // <div className="mt-8 bg-white rounded-md  shadow shadow-teal-100 p-6 flex items-center justify-center space-x-5 ">
            <img
              className="shadow-md"
              height={250}
              width={420}
              src={currentImage}
              key={currentImage}
              alt={`user-${currentImage}`}
            />
          ) : (
            // </div>
            <Webcam
              audio={false}
              height={250}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={420}
              videoConstraints={videoConstraints}
            />
          )}
        </div>
        <div className=" ml-5 ">
          {currentImage ? (
            <div className="flex flex-col space-y-10 justify-center items-center align-middle">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage("");
                }}
                className="shadow flex items-center p-2 rounded bg-teal-400 text-white font-bold tracking-wide"
              >
                Retake Image
              </button>
              <button
                onClick={send}
                className="shadow flex items-center p-2 rounded bg-teal-400 text-white font-bold tracking-wide "
              >
                <span>Send</span>
                <AiOutlineRight className="ml-3 " />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                capturedImage();
              }}
              className="shadow flex items-center p-2 rounded bg-teal-400 text-white font-bold tracking-wide "
            >
              <span>Capture</span>
            </button>
          )}
        </div>
      </div>
      {error?.length > 0 && (
        <div className="mt-5  flex items-center space-x-4 bg-red-100 shadow shadow-red-200 py-4 px-5 text-gray-400 rounded ">
          <BiError className="text-2xl text-red-400 " />
          <div className="text-md ">
            <p>{error}</p>
          </div>
        </div>
      )}
      {/* {loading && (
        <div className="w-[150px] mt-5 ">
          <CountdownProgressbar numSeconds={4} />
        </div>
      )} */}
      <ToastContainer />
    </div>
  );
};

export default VoterVerify;
