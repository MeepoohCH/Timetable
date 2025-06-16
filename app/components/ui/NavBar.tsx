'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#F7F7F7] text-gray-600 ">
      <div className="max-w-7xl px-4 py-3 flex justify-between items-center">
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`text-l md:flex space-x-6 ${isOpen ? 'block mt-4' : 'hidden'} md:mt-0`}>
          <Link href="#form-section" className="block py-2 md:py-0 hover:text-orange-600">
            ฟอร์ม
          </Link>
          <Link href="#schedule-section" className="block py-2 md:py-0 hover:text-orange-600">
            ตารางเรียน
          </Link>
          <Link href="#midterm-section" className="block py-2 md:py-0 hover:text-orange-600">
            สอบกลางภาค
          </Link>
          <Link href="#final-section" className="block py-2 md:py-0 hover:text-orange-600">
            สอบปลายภาค
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
