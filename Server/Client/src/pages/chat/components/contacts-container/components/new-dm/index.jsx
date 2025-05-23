import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react";
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";


const NewDm = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES,
                    { searchTerm },
                    { withCredentials: true },
                );

                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                }
            }
            else {
                setSearchedContacts([]);
            }
        } catch (error) {
            console.log(error);

        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
    };
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer duration-300 transition-all"
                            onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] w-[400px] h-[400px] text-white border-none flex flex-col ">
                    <DialogHeader>
                        <DialogTitle>Please select a contacts</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search for a contact"
                            className="bg-[#2c2e3b] border-none text-white placeholder:text-neutral-500 focus:border-none focus:outline-none focus:ring-0"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {searchedContacts.length > 0 && (
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col gap-5 mt-5">
                                {searchedContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className="flex gap-3 items-center cursor-pointer"
                                        onClick={() => selectNewContact(contact)}>
                                        <div className='h-12 w-12 relative'>
                                            <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                                                {contact.image ? (<AvatarImage
                                                    src={`${HOST}/${contact.image}`}
                                                    alt="profile"
                                                    className="object-cover w-full h-full bg-black rounded-full"
                                                />) : (
                                                    <div className={`uppercase h-12 w-12  text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                        {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
                                                    </div>
                                                )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>
                                                {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email}
                                            </span>
                                            <span className="text-xs">{contact.email}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                    {searchedContacts.length <= 0 && <div className="flex-1 md:flex mt-5 md:mt-0 flex-col justify-center items-center  duration-1000 transition-all ">
                        <Lottie
                            isClickToPauseDisabled={true}
                            height={100}
                            width={100}
                            options={animationDefaultOptions} />
                        <div className="text-white flex flex-col gap-5 items-center justify-center lg:text-2xl text-xl mt-5 transition-all duration-300 text-center transform hover:scale-105">
                            <h3 className="font-semibold poppins-medium text-opacity-90">
                                <span className="ml-2">Hi there</span>
                                <span className="text-purple-400">!</span> Search new <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text font-bold px-2">Contacts.</span>
                            </h3>
                        </div>
                    </div>}
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDm
