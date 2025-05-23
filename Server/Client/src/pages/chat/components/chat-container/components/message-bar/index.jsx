import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTES } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const {selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress} = useAppStore();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() =>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef]);
    
    const handleAddEmoji = (emoji) =>{
        setMessage((msg) => msg + emoji.emoji);
    };

    const handleSendMessage = async() => {
        if(selectedChatType === "contact"){
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content:message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
        }
        else if(selectedChatType === "channel"){
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content:message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id,
            });            
        }
        setMessage(""); 
    };

    const handleAttachmentClick = () => {
        if(fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async(e) =>{
        try {
            const file = e.target.files[0];
            if(file){
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
                    withCredentials: true, 
                    onUploadProgress: data =>{
                        setFileUploadProgress(Math.round((data.loaded * 100) / data.total));
                    }
                });

                if(response.status === 200 && response.data){
                    setIsUploading(false);
                    if(selectedChatType === "contact"){
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                        });
                    }
                    else if(selectedChatType === "channel"){
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id,
                        });
                    }
                }
            }
        } catch (error) {
            setIsUploading(false);
            console.log(error);
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    placeholder="Enter Message"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300'
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-2xl cursor-pointer" />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative">
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300'
                        onClick={ () => setEmojiPickerOpen(true)}
                    >
                        <RiEmojiStickerLine className="text-3xl cursor-pointer" />
                    </button>
                    <div className="absolute bottom-6 right-0" ref={emojiRef}>
                        <EmojiPicker 
                        theme="dark"
                        open={emojiPickerOpen}
                        onEmojiClick={handleAddEmoji}
                        autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:outline-none focus:text-white transition-all duration-300 cursor-pointer'
                onClick={handleSendMessage}
            >
                <IoSend className="text-2xl" />
            </button>
        </div>
    )
}

export default MessageBar
