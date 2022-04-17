/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import Candidate from "../Components/Candidate";
import sleep from "../Util/sleep";
import generateUUID from "../Util/random";
import { useNavigate, useLocation } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useUserContext } from "../context/userContext";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Lottie from "lottie-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useVerifiedContext } from "../context/verifiedContext";
import { useVoterContext } from "../context/voterContext";

// Encryption/Decryption
import { saveAs } from "file-saver";

const videoConstraints = {
  width: 180,
  height: 100,
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

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

// let uuid = generateUUID();
// var blob = new Blob(
//   [
//     "------------------------- Decryption Key -------------------------\n",
//     uuid,
//     "\n",
//     "------------------------- Decryption Key End -------------------------",
//   ],
//   {
//     type: "text/plain;charset=utf-8",
//   }
// );
// saveAs(blob, "Your_Secure_Key.iitj");

var CryptoJS = require("crypto-js");

const Voter = () => {
  const { verified } = useVerifiedContext();
  // const [candidates, setCandidates] = useState(dummyData);
  let [candidates, setCandidates] = useState({
    "General Secretary - SS": [],
    "General Secretary - SAC": [],
    "General Secretary - ACAC": [],
  });
  const time = 60;
  const [votedFor, setVotedFor] = useState(["", "", ""]);
  const [voted, setVoted] = useState([-1, -1, -1]);
  const canSubmit = voted.every((item) => item !== -1);

  const [timerEnd, setTimerEnd] = useState(true);

  const [loading, setLoading] = useState(true);

  const { user } = useUserContext();
  const [analyze, setAnalyze] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const { setVoted: voterStatus } = useVoterContext();

  const [currentImage, setCurrentImage] = useState("");
  const location = useLocation();

  const webcamRef = React.useRef(null);
  const navigate = useNavigate();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!verified) {
      navigate("/voterVerify");
    }
    // console.log(location.pathname);

    getCandidates();
  }, []);

  const checkIfSubmit = () => {
    for (let i = 0; i < voted.length; i++) {
      let n = voted[i].length - 1;
      let sum = voted[i].reduce((a, b) => a + b, 0);
      // for (let j = 0; j < n; j++) {
      console.log("Voted", voted[i]);
      console.log(
        "voted[i].reduce((a, b) => a + b, 0)",
        voted[i].reduce((a, b) => a + b, 0)
      );
      if (sum != (n * (n + 1)) / 2) {
        // alert("Your Preference is Wrong");
        toast.error("Your Preference is Wrong, Please Retry Voting", {
          position: "top-right",
          autoClose: 5000,
        });
        setTimeout(() => {
          navigate("/voterVerify");
        }, 4000);
        return false;
      } else if (sum == (n * (n + 1)) / 2) {
        // alert("Your Preference is Correct");
        // setTimerEnd(true);
        // navigate("/voterVerify");
        return true;
      } else {
        return false;
      }
    }
  };

  function getCandidates() {
    console.info("Getting Candidates");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/get_candidates", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log("Result:::::::", result.candidates[0]._id["$oid"]);
          let tempData = {
            "General Secretary - SS": [],
            "General Secretary - SAC": [],
            "General Secretary - ACAC": [],
          };
          for (let i = 0; i < result.candidates.length; i++) {
            if (result.candidates[i].position === "General Secretary - SS") {
              tempData["General Secretary - SS"].push(result.candidates[i]);
            } else if (
              result.candidates[i].position === "General Secretary - SAC"
            ) {
              tempData["General Secretary - SAC"].push(result.candidates[i]);
            } else if (
              result.candidates[i].position === "General Secretary - ACAC"
            ) {
              tempData["General Secretary - ACAC"].push(result.candidates[i]);
            }
          }
          // console.log("Temp Data:::::::", tempData);
          setCandidates(tempData);
          // setRefreshing(false);
          startCounting();
          setLoading(false);
          setTimeout(() => {
            // Navigate to the home route
            if (location.pathname === "/voter") {
              toast("Timer End Retry Voting", {
                autoClose: 3000,
                type: "error",
              });
              navigate("/voterVerify");
            }
          }, time * 1000);
          // forceUpdate();
        },
        (error) => {
          console.log("error", error);
        }
      );
  }
  // one minute counter for voting
  const [count, setCount] = useState(time);
  function startCounting() {
    const interval = setInterval(() => {
      setCount((count) => (count > 0 ? count - 1 : 0));
      // if (count === 0) {
      // }
      if (count > 0) {
        return () => clearInterval(interval);
      } else {
        return;
      }
    }, 1000);
  }

  const send = () => {
    console.log("Sending Vote");
    setAnalyze(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setTimerEnd(false);
    let uuid = generateUUID();
    var blob = new Blob(
      [
        "------------------------- Decryption Key -------------------------\n",
        uuid,
        "\n",
        "------------------------- Decryption Key End ---------------------\n",
      ],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    let data = {
      ss: votedFor[0],
      sac: votedFor[1],
      acac: votedFor[2],
    };

    // console.log(data);

    // Encrypt
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), uuid).toString();
    // console.log(encrypted);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Decrypt
    // var bytes = CryptoJS.AES.decrypt(encrypted, uuid);
    // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log(decryptedData);

    const obj = {
      image: imageSrc,
      voter: user?.uid,
      ss: votedFor[0],
      sac: votedFor[1],
      acac: votedFor[2],
      encrypted: encrypted,
    };

    // console.log("Sending data", obj);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/vote", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setAnalyze(false);
        if (result["vote_registered"]) {
          saveAs(blob, "Your_Secure_Key.iitj");
          setShowTick(true);
          setTimeout(() => {
            voterStatus(true);
            navigate("/dashboard");
          }, 5900);
        } else {
          setAnalyze(true);
          toast("Failed to register vote", {
            autoClose: 3000,
            type: "error",
          });
          setTimeout(() => {
            navigate("/voterVerify");
          }, 3000);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const vote = (index, candidate, Id) => {
    let tempVoted = [...votedFor];
    tempVoted[index] = Id;
    setVotedFor(tempVoted);
    const voted_ = voted;
    voted_[index] = candidate;
    setVoted(voted_);
    forceUpdate();
  };

  // const vote = (e, Id, category, preferenceNo) => {
  //   let tempVote = {
  //     id: Id,
  //     preference: parseInt(e.target.value),
  //   };
  //   let tempVoted = [...voted];
  //   if (category == "General Secretary - SS") {
  //     setVoteSS((voteSS) => [...voteSS, tempVote]);
  //     tempVoted[0][preferenceNo] = parseInt(e.target.value - 1);
  //   } else if (category == "General Secretary - SAC") {
  //     setVoteSAC((voteSAC) => [...voteSAC, tempVote]);
  //     tempVoted[1][preferenceNo] = parseInt(e.target.value - 1);
  //   } else if (category == "General Secretary - ACAC") {
  //     setVoteACAC((voteACAC) => [...voteACAC, tempVote]);
  //     tempVoted[2][preferenceNo] = parseInt(e.target.value - 1);
  //   }
  //   setVoted(tempVoted);
  //   // console.log("***********canSubmit: ", canSubmit);
  //   // console.log("***********voted: ", tempVote);
  //   // forceUpdate();
  //   // console.log("***********votedFor: ", votedFor);tempVote
  // };

  if (analyze) {
    return (
      <div className="h-screen bg-white flex flex-col justify-center items-center space-y-6 ">
        <Lottie
          animationData={require("../Images/vote.json")}
          style={{
            width: "300px",
            height: "300px",
          }}
        />
        <p className="font-bold text-2xl tracking-wide ">
          Registering your vote...
        </p>
      </div>
    );
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

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col bg-bg font-[Roboto] pt-4">
      {!loading && !analyze && !showTick ? (
        <div>
          <div className="flex justify-end items-center m-2 px-4 ">
            <span
              class={`font-mono text-4xl border-2   p-2 rounded-lg ${
                count < 10
                  ? "text-error border-error"
                  : "text-yellow-400 border-secondary_dark"
              }`}
            >
              <span> 00:{count} </span>
            </span>
            <div className="mx-4 flex items-center space-x-4 bg-orange-100 border border-orange-400 py-4 px-5 text-gray-400 rounded ">
              <AiOutlineInfoCircle className="text-2xl " />
              <div className="text-md ">
                <p>The voting process is being proctored.</p>
              </div>
            </div>

            <button
              className={` font-[Roboto] text-white font-bold px-4 py-2 rounded-lg shadow-lg 
        ${canSubmit ? "bg-primary" : "bg-gray-500"} `}
              onClick={() => {
                canSubmit && send();
              }}
            >
              Submit
            </button>
          </div>

          {Object.entries(candidates).map(([key, value], id) => (
            <div className="flex flex-col my-6 py-6 bg-white" key={key}>
              <h1 className=" font-bold text-4xl mb-4 inline-flex self-center text-black">
                {key}
              </h1>
              <Carousel
                swipeable
                responsive={responsive}
                // infinite
                itemClass="px-24 items-center justify-center flex flex-col"
                centerMode
                pauseOnHover={true}
                additionalTransfrom={0}
                arrows
                dotListClass=""
                draggable
                autoPlaySpeed={1000000}
                focusOnSelect={false}
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                // customLeftArrow={customLeftArrow}
                // customRightArrow={customRightArrow}
              >
                {value.map((item, index) => (
                  <div className="flex flex-col" key={item.id}>
                    <Candidate
                      name={item.name}
                      image={item.photo}
                      uid={item.id}
                      onClick={() => vote(id, index, item._id["$oid"])}
                      disabled={votedFor[id] !== ""}
                      voted={votedFor[id] === item._id["$oid"]}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center ">
          <Lottie
            animationData={require("../Images/loading.json")}
            style={{
              width: "600px",
              height: "600px",
            }}
            loop={true}
          />
        </div>
      )}
      <ToastContainer />
      <div className="absolute left-4 top-[70px] ">
        <Webcam
          audio={false}
          height={100}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={180}
          videoConstraints={videoConstraints}
          className="rounded-md shadow-md "
        />
      </div>
    </div>
  );
};

export default Voter;
