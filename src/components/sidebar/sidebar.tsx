'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigLeft, ArrowBigRight, Box, Boxes, Building, DollarSign, Droplets, Fish, FishOffIcon, FishSymbolIcon, HomeIcon, LayoutDashboard, LayoutList, Leaf, LineChart, LucideQrCode, Menu, Settings, User, Users, Waves, XIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleResizeMobile = () => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  };

  useEffect(() => {
    handleResizeMobile();

    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, toggleSidebar]);

  const isActivePage = (href: string) => {
    return pathname === href;
  };


  return (
    <div className="fixed z-50 flex mb-52 ">
      <div className={`fixed z-50 transition-all duration-300 mb-52 overflow-y-auto ${isOpen ? "w-64" : "w-0"} ${isOpen && isMobile ? "w-full" : ""} min-h-screen`} style={{ background: process.env.NEXT_PUBLIC_COR_PRINCIPAL }}>
        {isOpen && (
          <>
            <ScrollArea className="flex h-screen overflow-y-auto ">
              <div className="text-center py-5 flex justify-center h-20  items-center gap-2 border-b border-b-neutral-400 mb-2">
                <Link href={'/processos'}><Image src="/logo.png" width={50} height={50} alt="Rewind-UI" className="rounded-sm" priority /></Link>
                <XIcon onClick={toggleSidebar} className=" sm:hidden absolute top-8 right-8 text-white" />
              </div>
              <div className="flex flex-col gap-1 ">
                <Card className="rounded-xl text-white mx-2 border-none"
                  style={{ background: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                  <Accordion type="single" collapsible defaultValue="item-1" className="rounded-xl py-3">
                    <AccordionItem value="item-1" className="border-none">
                      <AccordionTrigger className={`flex items-center ml-8 mr-3 text-lg max-h-1 list-none`}>
                        Menu
                      </AccordionTrigger>
                      <AccordionContent>
                      <Link href="/pedidos" className={`flex  items-center px-8 h-10 w-full py-5 pt-7`}
                          style={{ color: isActivePage("/painel") ? process.env.NEXT_PUBLIC_COR_PRINCIPAL : "", background: process.env.NEXT_PUBLIC_COR_SECUNDARIA, borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                          <LayoutList size={24} strokeWidth={1.5} className="mr-2" />
                          Pedidos
                        </Link>
                        <Link href="/produtos" className={`flex  items-center px-8 h-10 w-full py-5 pt-7`}
                          style={{ color: isActivePage("/processos") ? process.env.NEXT_PUBLIC_COR_PRINCIPAL : "", background: process.env.NEXT_PUBLIC_COR_SECUNDARIA, borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                          <Settings size={24} strokeWidth={1.5} className="mr-2" />
                          Produtos
                        </Link>
                        <Link href="/clientes" className={`flex  items-center px-8 h-10 w-full py-5 pt-7`}
                          style={{ color: isActivePage("/clientes") ? process.env.NEXT_PUBLIC_COR_PRINCIPAL : "", background: process.env.NEXT_PUBLIC_COR_SECUNDARIA, borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                          <Users size={24} strokeWidth={1.5} className="mr-2" />
                          Clientes
                        </Link>
                        <Link href="/usuarios" className={`flex  items-center px-8 h-10 w-full py-5 pt-7`}
                          style={{ color: isActivePage("/usuarios") ? process.env.NEXT_PUBLIC_COR_PRINCIPAL : "", background: process.env.NEXT_PUBLIC_COR_SECUNDARIA, borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                          <User size={24} strokeWidth={1.5} className="mr-2" />
                          Usuários
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </div>
            </ScrollArea>
          </>
        )}
      </div>
      <Button onClick={toggleSidebar} className={`absolute z-50 top-72 hidden sm:block ${isOpen ? "left-60" : "left-2"} transform -translate-x-1/2 transition-all  duration-300`}>
        {isOpen ? <ArrowBigLeft size={50} /> : <ArrowBigRight size={50} />}
      </Button>

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border text-slate-300 flex justify-around items-center p-2 sm:hidden">
        <Link href="/processos">
          <div className="flex flex-col items-center justify-center">
            <Settings style={{ color: process.env.NEXT_PUBLIC_COR_PRINCIPAL }} />
          </div>
        </Link>
        <Link href="/caixas">
          <div className="flex flex-col items-center justify-center">
            <Box style={{ color: process.env.NEXT_PUBLIC_COR_PRINCIPAL }} />
          </div>
        </Link>
        <Link href="/peixes">
          <div className="w-12 h-12 rounded-full border border-slate-400 flex justify-center items-center">
            <Fish style={{ color: process.env.NEXT_PUBLIC_COR_PRINCIPAL }} />
          </div>
        </Link>
        <Link href="/clientes">
          <div className="flex flex-col items-center justify-center">
            <Users style={{ color: process.env.NEXT_PUBLIC_COR_PRINCIPAL }} />
          </div>
        </Link>
        <div onClick={toggleSidebar} className="flex flex-col items-center justify-center">
          <Menu style={{ color: process.env.NEXT_PUBLIC_COR_PRINCIPAL }} />
        </div>
      </div>
    </div >
  );
}

export default Sidebar;