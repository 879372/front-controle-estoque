import Link from "next/link";
import { useEffect, useState } from 'react';
import { CreditCard, Lock, LockIcon, LogOut, User, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import InputMask from 'react-input-mask';
import { toast } from "react-toastify";
import { patchUserId, PatchUsersIdRequest } from "@/api/axios/usuarios/patchUserId";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  titulo: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ titulo, isOpen, toggleSidebar }: HeaderProps) {
  const { companyId } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataUpdatePassword, setDataUpdatePassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [dataUpdateUser, setDataUpdateUser] = useState({ username: '' });
  const [modalOpenPassword, setModalOpenPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const submitUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const response = await patchPasswordUserId(dataUpdatePassword, companyId);
      setModalOpenPassword(false);
      toast.success('Senha atualizada com sucesso.');
      // console.log(response)
      console.log(dataUpdatePassword)
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Erro ao atualizar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const response = await patchUserId(dataUpdateUser, companyId);
      setModalOpen(false);
      toast.success('Usuário atualizado com sucesso.');
      // console.log(response)
      console.log(dataUpdatePassword)
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Erro ao atualizar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const MenuOpen = () => {
    setMenuOpen(!menuOpen);
    toggleSidebar();
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataUpdatePassword((prevRegister) => ({
      ...prevRegister,
      [name]: value,
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataUpdateUser((prevRegister) => ({
      ...prevRegister,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (dataUpdatePassword.newPassword !== dataUpdatePassword.confirmPassword) {
      setError('As senha devem ser idênticas!')
    } else {
      setError('')
    }
  }, [dataUpdatePassword.newPassword, dataUpdatePassword.confirmPassword])

  return (
    <>
      <header
        className={`flex-1 transition-margin duration-300 ease-in-out bg-white flex justify-between h-20 items-center border-b-2 fixed px-6 z-40`}
        style={{ width: isOpen ? (isSmallScreen ? '100%' : 'calc(100% - 256px)') : '100%' }}
      >
        <h1 className="text-4xl font-extrabold text-[#0a4273]">{titulo}</h1>
        <nav className="relative flex items-center">
          {!isSmallScreen && (<ul
            className={`flex items-center text-black gap-3 ${menuOpen ? 'hidden' : 'hideen'
              } md:flex absolute right-0 top-20 md:static p-3 bg-white md:bg-transparent md:shadow-none shadow-md md:rounded-none rounded-md`}
          >
            <li className="p-2 rounded-lg hover:bg-slate-100 text-xs cursor-pointer" >
              <div onClick={() => {setModalOpen(true); toggleSidebar(); setModalOpenPassword(false);}} className="flex flex-col justify-center items-center">
                <User className="text-zinc-500 text-xs" />
                <span>Perfil</span>
              </div>
            </li>
            <li className="p-2 rounded-lg hover:bg-slate-100 text-xs cursor-pointer" >
              <div onClick={() => {setModalOpenPassword(true); toggleSidebar(); setModalOpen(false);}} className="flex flex-col justify-center items-center">
                <Lock className="text-zinc-500 text-xs" />
                <span>Senha</span>
              </div>
            </li>
            <li className="p-2 rounded-lg hover:bg-slate-100 text-xs">
              <Link href="/" className="flex flex-col justify-center items-center">
                <LogOut className="text-zinc-500 text-xs" />
                <span>Sair</span>
              </Link>
            </li>
          </ul>
          )}
        </nav>
        {modalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <form onSubmit={submitUpdateUser} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
                <div className="bg-white px-4 pt-5 pb-4 ">
                  <div className="">
                    <div className='flex items-center gap-2'>
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                        <User2 className="h-6 w-6" style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                      </div>
                      <h3 className="text-lg leading-6 font-medium" id="modal-title">
                        Editar Usuário
                      </h3>
                    </div>
                    <div className="mt-3  sm:mt-0 sm:ml-4  ">
                      <div className="mt-5">
                        <div >
                          <div className="flex flex-col gap-2">
                            <div>
                              <Label htmlFor='username'>Username</Label>
                              <Input
                                type="text"
                                id="username"
                                name="username"
                                value={dataUpdateUser.username}
                                onChange={handleChange}
                                required
                                style={{ fontSize: '16px' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button className="w-full shadow-sm text-white  sm:ml-3 sm:w-auto sm:text-sm"
                    style={{ background: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}
                    type='submit'
                  >
                    {loading ? <span className="loading loading-spinner loading-xs"></span>
                      : 'Salvar'}
                  </Button>
                  <Button
                    variant={'secondary'}
                    onClick={() => setModalOpen(false)}
                    className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>
      {modalOpenPassword && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <form onSubmit={submitUpdatePassword} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
              <ScrollArea>
                <div className="bg-white px-4 pt-5 pb-4 ">
                  <div className="">
                    <div className='flex items-center gap-2'>
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-0 sm:h-10 sm:w-10">
                        <LockIcon className="h-6 w-6" aria-hidden="true"
                          style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} />
                      </div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Alterar Senha
                      </h3>
                    </div>
                    <div className="mt-3  sm:mt-0 sm:ml-4  ">
                      <div className="mt-5">
                        <div >
                          <div className="flex flex-col gap-2 w-full">
                            <div>
                              <Label htmlFor='oldPassword'>Senha atual*</Label>
                              <Input
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                onChange={handleChangePassword}
                                placeholder='Digite a senha atual'
                                required
                                style={{ fontSize: '16px' }}
                              />
                            </div>
                            <div>
                              <Label htmlFor='newPassword'>Nova senha*</Label>
                              <Input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                onChange={handleChangePassword}
                                placeholder='Digite a nova senha'
                                required
                                style={{ fontSize: '16px' }}
                              />
                            </div>
                            <div>
                              <Label htmlFor='password'>Confirme a senha*</Label>
                              <Input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                onChange={handleChangePassword}
                                placeholder='Confirme a nova senha'
                                required
                                style={{ fontSize: '16px' }}
                              />
                            </div>
                          </div>
                          {error && <span className='text-red-500'>{error}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#095163] text-base font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-100 sm:ml-3 sm:w-auto sm:text-sm"
                  type='submit'
                  disabled={dataUpdatePassword.oldPassword === '' || dataUpdatePassword.newPassword === '' || dataUpdatePassword.confirmPassword === '' || dataUpdatePassword.newPassword !== dataUpdatePassword.confirmPassword}
                >
                  {loading ? <span className="loading loading-spinner loading-xs"></span>
                    : 'Salvar'}
                </Button>
                <Button
                  onClick={() => setModalOpenPassword(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}  