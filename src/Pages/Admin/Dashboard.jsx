// @ts-nocheck
import { useState, Fragment } from "react";
import { Tab } from "@headlessui/react";
import { Dialog, Transition, Listbox } from "@headlessui/react";

import { HiPlusCircle, HiBadgeCheck } from "react-icons/hi";
import { FiRefreshCw } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { SiEnpass } from "react-icons/si";
import { RiShieldCheckFill } from "react-icons/ri";
import { AiOutlineNumber } from "react-icons/ai";

import compress from "compress-base64";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const people = [
  { name: "General Secretary - SS" },
  { name: "General Secretary - ACAC" },
  { name: "General Secretary - SAC" },
];

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function AdminDashboard() {
  const [selected, setSelected] = useState(people[0]);
  const forceUpdate = useForceUpdate();
  const navigate = useNavigate();

  // get candidates in usestate
  useState(() => {
    // setBoothData();
    getBoothData();
    getDashboardData();
    getCandidates();
  }, []);

  let [candidates, setCandidates] = useState({
    "General Secretary - SS": [],
    "General Secretary - SAC": [],
    "General Secretary - ACAC": [],
  });

  let [votes, setVotes] = useState({});

  // * Models
  let [isAddOpen, setIsAddOpen] = useState(false);
  let [isBypassOpen, setIsBypassOpen] = useState(false);
  let [isCheckVoteOpen, setIsCheckVoteOpen] = useState(false);

  let [refreshing, setRefreshing] = useState(true);

  // let [candidateImage, setCandidateImage] = useState("");
  // let [candidateName, setCandidateName] = useState("");

  let [countData, setCountData] = useState({});
  let [boothStatus, setBoothStatus] = useState({
    is_polling: false,
    is_preRegistering: false,
  });

  // let [boothStatus, setBoothStatus] = useState(false);

  // Refresh Function
  function refresh() {
    setRefreshing(true);
    getDashboardData();
    getCandidates();
  }

  function getVotes() {
    console.info("Getting Count Data");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/votes_countal", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log("booth Data votes_countal  :::::::::", result);
          let counts = {};

          result.result.forEach((x) => {
            // counts[x] = (counts[x] || 0) + 1;
            // console.log("Value of x : ", x);
            Object.entries(x).forEach(([key, value], index) => {
              if (key != "_id") {
                // console.log("key :", key, " Value: ", value, " index: ", index);
                counts[value] = (counts[value] || 0) + 1;
              }
            });
          });

          // console.log("Counts : ", counts);

          setVotes(counts);

          // let tempData = {
          //   is_polling: true,
          //   is_preRegistering: true,
          // };
          // tempData["is_polling"] = result["status"][0]["is_polling"];
          // tempData["is_preRegistering"] =
          //   result["status"][0]["is_preRegistering"];
          // setBoothStatus(tempData);
          // forceUpdate();
        },
        (error) => {
          console.log("error", error);
        }
      );
  }

  // Get Dashboard Data
  function getBoothData() {
    console.info("Getting Count Data");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/booth_status", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log("booth Data result.is_polling  :::::::::", result);
          let tempData = {
            is_polling: true,
            is_preRegistering: true,
          };
          tempData["is_polling"] = result["status"][0]["is_polling"];
          tempData["is_preRegistering"] =
            result["status"][0]["is_preRegistering"];
          setBoothStatus(tempData);
          // forceUpdate();
        },
        (error) => {
          console.log("error", error);
        }
      );
  }

  function setBoothData(is_polling, is_preRegistering) {
    let tempData = {
      is_polling: is_polling,
      is_preRegistering: is_preRegistering,
    };
    setBoothStatus(tempData);
    // setBoothStatus((boothStatus) => !boothStatus);
    // forceUpdate();
    sendBoothData(is_polling, is_preRegistering);
  }

  function sendBoothData(is_polling, is_preRegistering) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

    const obj = {
      is_polling: is_polling,
      is_preRegistering: is_preRegistering,
      id: "1234",
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/edit_booth_status", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("setBoothData Success", result);
        // console.log("boothStatus", boothStatus);
        // forceUpdate();
      })
      .catch((error) => console.log("error", error));
  }

  function getDashboardData() {
    console.info("Getting Count Data");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/get_count", requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log("result :::::::::", result);
          setCountData(result);
          // forceUpdate();
        },
        (error) => {
          console.log("error", error);
        }
      );
  }

  // Get Candidates
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
          setCandidates(tempData);
          setRefreshing(false);
          // forceUpdate();
        },
        (error) => {
          console.log("error", error);
        }
      );
  }

  // function closeAddModal() {
  //   setIsAddOpen(false);
  // }

  function openAddModal() {
    setIsAddOpen(true);
  }

  function closeBypassModal() {
    setIsBypassOpen(false);
  }

  function openBypassModal() {
    setIsBypassOpen(true);
  }

  function closeCheckVoteModal() {
    setIsCheckVoteOpen(false);
  }

  function openCheckVoteModal() {
    setIsCheckVoteOpen(true);
  }

  function addCandidate(name, image) {
    // console.log("Add Candidate");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

    const obj = {
      name: name,
      position: selected.name,
      photo: image,
      id: "1234",
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/add_candidate", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("Success", result);
        if (result.status) {
          // getCandidates();
          setIsAddOpen(false);
        }
      })
      .catch((error) => console.log("error", error));
  }

  function bypassUser(uid) {
    // console.log("Bypass User: ", uid);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

    const obj = {
      voter: uid,
      id: "1234",
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/add_bypass", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("Success", result);
        if (result.status) {
          // getCandidates();
          closeBypassModal();
        }
      })
      .catch((error) => console.log("error", error));
  }

  function checkUserVote(uid, uuid) {
    // console.log("Check User Vote: ", uuid);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");

    const obj = {
      voter: uuid,
      id: "1234",
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
    };

    fetch("https://voting.prometeo.in/check_user_vote", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("Success", result);
        if (result.status) {
          // getCandidates();
          closeBypassModal();
        }
      })
      .catch((error) => console.log("error", error));
  }

  const AddModel = () => {
    let [candidateImage, setCandidateImage] = useState("");
    let [candidateName, setCandidateName] = useState("");

    function onChange(event) {
      var file = event.target.files[0];
      // var reader = new FileReader();
      // reader.onload = function () {
      //   setCandidateImage(reader.result);
      // };
      // reader.readAsDataURL(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        compress(event.target.result, {
          width: 400,
          type: "image/png", // default
          max: 200, // max size
          min: 20, // min size
          quality: 0.8,
        }).then((result) => {
          setCandidateImage(result);
        });
      };
      reader.readAsDataURL(file);
    }

    return (
      <Transition appear show={isAddOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-1 h-64 min-h-screen w-full"
          onClose={() => {
            setIsAddOpen(false);
            setCandidateImage("");
            setCandidateName("");
          }}
        >
          <div className="min-h-screen px-4 text-center">
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex flex-col space-y-4 justify-between">
                  <div className="flex w-full">
                    Name:{" "}
                    <input
                      className="w-full ml-4 border-b-2 border-primary focus:outline-none"
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      // onChange={(e) => {
                      //   // console.log(candidateName);
                      //   uid = e.target.value;
                      // }}
                    />
                  </div>
                  <div className="flex w-full">
                    Photo:{" "}
                    <input
                      type="file"
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      onChange={(event) => onChange(event)}
                    />
                  </div>
                  <Listbox value={selected} onChange={setSelected}>
                    <Listbox.Button className="flex cursor-pointer justify-between w-full py-2 px-3 text-left bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      {selected.name}
                      <RiArrowDropDownLine className="" size={25} />
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-out duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {people.map((person) => (
                          <Listbox.Option
                            key={`Addmodel-${person.id}`}
                            value={person}
                            disabled={person.unavailable}
                            className={({ active }) =>
                              ` cursor-pointer select-none relative py-2 px-4 ${
                                active
                                  ? "text-amber-900 bg-amber-100"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`truncate flex ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {selected ? (
                                    <span className=" items-center  text-amber-600">
                                      <HiBadgeCheck className="" size={25} />
                                    </span>
                                  ) : null}
                                  {person.name}
                                </span>
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </Listbox>
                  {candidateImage && (
                    <img
                      src={candidateImage}
                      alt="candidate"
                      className="w-36 h-36 rounded-full self-center"
                    />
                  )}
                  <button
                    onClick={() => addCandidate(candidateName, candidateImage)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const BypassModel = () => {
    let [uid, setUid] = useState("");
    return (
      <Transition appear show={isBypassOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-1 h-64 min-h-screen w-full"
          onClose={closeBypassModal}
        >
          <div className="min-h-screen px-4 text-center">
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex flex-col space-y-4 justify-between">
                  <div className="flex w-full text-lg">
                    User Id:{" "}
                    <input
                      className="w-full ml-4 border-b-2 border-primary focus:outline-none"
                      type="text"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                    />
                  </div>
                  <button onClick={() => bypassUser(uid)}>Bypass User</button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const CheckVoteModel = () => {
    let [uuid, setUuid] = useState("");
    let [uid, setUid] = useState("");
    return (
      <Transition appear show={isCheckVoteOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-1 h-64 min-h-screen w-full"
          onClose={closeCheckVoteModal}
        >
          <div className="min-h-screen px-4 text-center">
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex flex-col space-y-4 justify-between">
                  <div className="flex w-full text-lg">
                    UUID:{" "}
                    <input
                      className="w-full ml-4 border-b-2 border-primary focus:outline-none"
                      type="text"
                      value={uuid}
                      onChange={(e) => setUuid(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full text-lg">
                    UID:{" "}
                    <input
                      className="w-full ml-4 border-b-2 border-primary focus:outline-none"
                      type="text"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                    />
                  </div>
                  <button onClick={() => checkUserVote(uuid)}>
                    Check Vote
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <>
      <div className="flex w-full px-6 my-6 justify-between ">
        <div className="space-x-4">
          {boothStatus["is_polling"] ? (
            <button
              className="p-2 bg-success rounded-lg shadow-lg text-lg font-bold text-black hover:bg-primary_dark hover:text-white duration-200 ease-out"
              onClick={() =>
                setBoothData(false, boothStatus["is_preRegistering"])
              }
            >
              End Poll
            </button>
          ) : (
            <button
              className="p-2 bg-error rounded-lg shadow-lg text-lg font-bold text-white hover:bg-error_dark duration-200 ease-out"
              onClick={() =>
                setBoothData(true, boothStatus["is_preRegistering"])
              }
            >
              Start Poll
            </button>
          )}
          {boothStatus["is_preRegistering"] ? (
            <button
              className="p-2 bg-success rounded-lg shadow-lg text-lg font-bold text-black hover:bg-primary_dark hover:text-white duration-200 ease-out"
              onClick={() => setBoothData(boothStatus["is_polling"], false)}
            >
              End Pre-Registering
            </button>
          ) : (
            <button
              className="p-2 bg-success rounded-lg shadow-lg text-lg font-bold text-black hover:bg-primary_dark hover:text-white duration-200 ease-out"
              onClick={() => setBoothData(boothStatus["is_polling"], true)}
            >
              Start Pre-Registering
            </button>
          )}
        </div>
        <div className="flex justify-self-end place-self-end self self-end space-x-4">
          <button
            className="p-2 bg-success rounded-lg shadow-lg text-lg font-bold text-black hover:bg-primary_dark hover:text-white duration-200 ease-out flex items-center"
            onClick={openAddModal}
          >
            <HiPlusCircle className="mr-2" size={25} />
            Add Candidate
          </button>
          <button
            className="p-2 bg-success rounded-lg shadow-lg text-lg font-bold text-black hover:bg-primary_dark hover:text-white duration-200 ease-out flex items-center"
            onClick={openCheckVoteModal}
          >
            <RiShieldCheckFill className="mr-2" size={25} />
            Check Vote
          </button>
          <button
            className="p-2 bg-success rounded-lg shadow-lg text-lg font-bold text-black hover:bg-primary_dark hover:text-white duration-200 ease-out flex items-center"
            onClick={() => navigate("/failed")}
          >
            <SiEnpass className="mr-2" size={25} />
            Failed Votes
          </button>
          <button
            className="p-2 bg-primary rounded-lg shadow-lg text-lg font-bold text-white hover:bg-primary_dark duration-200 ease-out flex items-center"
            onClick={getVotes}
          >
            <AiOutlineNumber size={25} className="mr-2" />
            Count Vote
          </button>
          <p className="p-2 rounded-lg shadow-lg text-lg font-bold border-2 duration-200 ease-out border-secondary">
            <span className="text-primary">
              <strong>Votes: </strong>
            </span>
            <span className="text-lg">
              <strong>
                {countData.voted}/{countData.preregistered}
              </strong>
            </span>
          </p>
          <button
            className="flex items-center px-4  rounded-lg shadow-lg text-lg font-bold border-2 duration-100 ease-out hover:border-secondary_dark border-secondary text-black"
            onClick={refresh}
          >
            {/* <HiRefresh className=" animate-spin" /> */}
            <FiRefreshCw className={` ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      <AddModel />
      <BypassModel />
      <CheckVoteModel />
      <div className="mx-6 py-6 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex  p-1 space-x-1 bg-blue-900/20 rounded-xl">
            {Object.keys(candidates).map((candidate) => (
              <Tab
                key={candidate}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg",
                    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                    selected
                      ? "bg-white shadow"
                      : "text-blue-500 hover:bg-white/[0.12] hover:text-black"
                  )
                }
              >
                {candidate}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {!refreshing ? (
              Object.values(candidates).map((posts, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    "bg-white rounded-xl p-3",
                    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  )}
                >
                  <ul>
                    {posts.map((post, index) => (
                      <li
                        key={post.id + index}
                        className="relative p-3 hover:bg-coolGray-100 flex bg-bg my-2 rounded-lg"
                      >
                        <img
                          src={post.photo}
                          alt={post.name}
                          className="h-36 w-36 mr-5 rounded-full"
                        />

                        <div className="flex flex-col justify-evenly">
                          <h3 className=" text-2xl font-medium leading-5">
                            Name:{" "}
                            <span className=" text-blue-700">{post.name}</span>
                          </h3>
                          <h3 className=" text-2xl font-medium leading-5">
                            Id: {post._id["$oid"]}
                          </h3>
                          <h3 className=" text-2xl font-medium leading-5">
                            Votes:{" "}
                            {votes[post._id["$oid"]]
                              ? votes[post._id["$oid"]]
                              : 0}
                          </h3>
                          <a
                            href="#"
                            className={classNames(
                              "absolute inset-0 rounded-md",
                              "focus:z-10 focus:outline-none focus:ring-2 ring-blue-400"
                            )}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Tab.Panel>
              ))
            ) : (
              <div className=" h-24 flex flex-col align-middle items-center justify-center">
                <FiRefreshCw className=" animate-spin" size={50} />
                <p>Refreshing</p>
              </div>
            )}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}
