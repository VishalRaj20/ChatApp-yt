import { apiClient } from '@/lib/api-client';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { FiEdit2, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
 
const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const Logout = async() => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {},{
                withCredentials: true,
            });

            if(response.status === 200) {
                navigate("/auth");
                setUserInfo(null)
            }
        } catch (error) {
            console.error("Logout error:", error);         
        }
    };
    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] '>
            <div className="flex gap-3 items-center justify-center">
                <div className='h-12 w-12 relative rounded-full'>
                    <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                        {userInfo.image ? (<AvatarImage
                            src={`${HOST}/${userInfo.image}`}
                            alt="profile"
                            className="object-cover w-full h-full rounded-full"
                        />) : (
                            <div className={`uppercase h-12 w-12  text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2  className="text-purple-400 text-xl cursor-pointer"
                            onClick={() => navigate("/profile")}/>
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white p-1.5 rounded-md' >
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiLogOut  className="text-red-400 text-xl cursor-pointer"
                            onClick={Logout}/>
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white p-1.5 rounded-md' >
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo
