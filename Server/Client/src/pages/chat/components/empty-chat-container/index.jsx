import { animationDefaultOptions } from "@/lib/utils"
import Lottie from "react-lottie"

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all ">
      <Lottie
      isClickToPauseDisabled={true}
      height={200}
      width={200}
      options={animationDefaultOptions}/>
      <div className="text-white flex flex-col gap-5 items-center justify-center lg:text-4xl text-3xl mt-10 transition-all duration-300 text-center transform hover:scale-105">
        <h3 className="font-semibold poppins-medium text-opacity-90">
          <span className="inline-block animate-waving-hand">👋</span>
          <span className="ml-2">Hi there</span>
          <span className="text-purple-400">!</span> Welcome to
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text font-extrabold px-2">
            Synchronous
          </span>
          Chat App
          <span className="text-purple-400">.</span>
        </h3>
        <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
          Connect. Chat. Collaborate. — Real-time messaging made elegant.
        </p>
      </div>
    </div>
  )
}

export default EmptyChatContainer
