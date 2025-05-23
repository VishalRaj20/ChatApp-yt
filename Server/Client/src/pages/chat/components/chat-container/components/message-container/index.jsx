import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTES, GET_CHANNEL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages,setIsDownloading, setFileDownloadProgress } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTES,
          { id: selectedChatData._id },
          { withCredentials: true },
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
c
      }
    }

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true },
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);

      }      
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();

    }
  }, [selectedChatData, selectedChatType])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };


  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = lastDate !== messageDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (<div className="text-center text-gray-400 my-2">
            {moment(message.timestamp).format("LL")}
          </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress:(ProgressEvent) =>{
        const {loaded, total} = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  }

  const renderDMMessages = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
      {message.messageType === "text" && (
        <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
          : "bg-gray-700 text-white border-[#ffffff]/80"
          }border inline-block py-2 px-3 rounded-md my-1 max-w-[40%] break-words`}>
          {message.content}
        </div>
      )}
      {
        message.messageType === "file" && (
          <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
            : "bg-gray-700 text-white border-[#ffffff]/80"
            }border inline-block py-2 px-3 rounded-md my-1 max-w-[40%] break-words`}>
            {checkIfImage(message.fileUrl) ? <div className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
                alt="file"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div> : <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>}
          </div>
        )
      }
      <div className="text-grey-400 text-xs">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessage = (message) => {
    const isSender = message.sender._id === userInfo.id;

    return (
      <div className={`mt-5 ${!isSender ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isSender
                ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
                : "bg-gray-700 text-white border-[#ffffff]/80"
            } border inline-block py-2 px-3 rounded-md my-1 max-w-[40%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
      {
        message.messageType === "file" && (
          <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
            : "bg-gray-700 text-white border-[#ffffff]/80"
            }border inline-block py-2 px-3 rounded-md my-1 max-w-[40%] break-words`}>
            {checkIfImage(message.fileUrl) ? <div className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
                alt="file"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div> : <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>}
          </div>
        )
      }
        {!isSender && (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-6 w-6 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-6 w-6 text-md flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.charAt(0)
                  : message.sender?.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <div className="text-xs text-white/60 mt-1">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        )}

        {isSender && (
          <div className="text-xs text-white/40 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
      {
        showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg- cover" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}>
              <IoMdArrowRoundDown />
            </button>
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer
