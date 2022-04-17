import { AiOutlineCheck } from "react-icons/ai";

const Candidate = ({ name, image, onClick, disabled, voted }) => {
  return (
    <div className="bg-white border shadow-md shadow-teal-100 w-[200px] py-4 px-2 space-y-4 rounded-lg flex flex-col items-center font-[Roboto]  ">
      <img
        src={image}
        alt="candidate"
        className="w-[100px] h-[100px] rounded-full object-cover object-top "
      />
      <p className="text-2xl font-medium tracking-wide">{name}</p>
      <button
        className={`py-2 px-6 text-white flex items-center justify-center text-lg space-x-4 rounded-lg shadow-md ${
          voted ? "bg-green-500" : disabled ? "bg-gray-500" : "bg-blue-500"
        } `}
        onClick={() => !(voted || disabled) && onClick()}
      >
        <span>{voted ? "Voted" : "Vote"}</span>
        <AiOutlineCheck />
      </button>
    </div>
  );
};

export default Candidate;
