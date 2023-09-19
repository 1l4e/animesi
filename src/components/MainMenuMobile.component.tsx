"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Settings, Workflow, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./themeSwicher.component";

const menus = [
  { id: 1, title: "Trang chủ", slug: "/", icon: Home },
  { id: 5, title: "Nguồn phim", slug: "/phim", icon: Workflow },
  {
    id: 4,
    title: "Setting",
    slug: "/dashboard/profile",
    icon: Settings,
    child: {},
  },
];

export default function MainMenuMobile({ safe }: { safe: boolean }) {
  const [isOpen, setIsOpen] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const prevScrollPos = useRef(0);

  const toggleSubmenu = (id: number) => {
    if (id === isOpen) {
      setIsOpen(NaN);
      return;
    }
    setIsOpen(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsHeaderVisible(prevScrollPos.current - currentScrollPos >= 0);
      prevScrollPos.current = currentScrollPos;
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    setIsOpen(NaN);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`${
        isHeaderVisible ? "visible" : "hidden"
      } bg-white dark:bg-black fixed top-0 left-0 h-16 w-full  border-t z-[999]`}
    >
      <div
        className={`${
          !isOpen && "hidden"
        } overlay fixed top-0 right-0 w-full h-full `}
        onClick={() => setIsOpen(NaN)}
      ></div>
      <ul className="flex justify-around ">
        {menus.map((item: any, index: number) => {
          const Icon = item.icon;
          return (
            <li key={index} className="relative flex-1 flex justify-center">
              {item.child ? (
                <button className="" onClick={(e) => toggleSubmenu(index)}>
                  <span className="h-16 flex relative text-sm justify-center items-center flex-col w-full text-center font-light">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ rotate: isOpen ? 360 : 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      {!isNaN(isOpen) ? <X size={24} /> : <Icon size={24} />}
                    </motion.div>
                    <span>{!isNaN(isOpen) ? "Close" : item.title}</span>
                  </span>
                </button>
              ) : (
                <Link href={`${item.slug}`} title={item.title}>
                  <span className="h-16 flex relative text-sm justify-center items-center flex-col w-full text-center font-light">
                    <Icon size={24} />
                    <span>{item.title}</span>
                  </span>
                </Link>
              )}

              {isOpen === index && (
                <AnimatePresence>
                  {item.child && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="fixed bottom-16 left-0 w-full h-96 bg-white dark:bg-black  z-10 pt-2 border-t"
                    >
                      <div className="h-34 flex justify-center items-center flex-col">
                        <h2 className="text-2xl text-center py-2">
                          {item.title}
                        </h2>
                      </div>
                      <ThemeSwitcher />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
