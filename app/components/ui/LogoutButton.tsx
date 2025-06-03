"use client"

import { button } from 'framer-motion/client';
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login')
    }

    return(
        <button
            type="button"
            onClick={handleLogout}
            className='rounded-[15px]  bottom-0 mt-1  w-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#F96D00] text-white gap-6 hover:bg-white hover:text-[#F96D00] dark:hover:bg-[#ccc] text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5 '
        >
            LOG OUT
        </button>
    )
}
