'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Box, ChevronLeft, ChevronRight, CreditCard, Edit, Fish, Search, X } from 'lucide-react';;
import { toast } from 'react-toastify';
import Sidebar from '@/components/sidebar/sidebar';
import Header from '@/components/header/header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Peixes() {
    const [isOpen, setIsOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalRegister, setModalRegister] = useState<boolean>(false);
    const [modalOpenConfirm, setModalOpenConfirm] = useState<boolean>(false);
    const [editPagamento, setEditPagameto] = useState({ id: '', descricao: '', fk_bandeira: 0, taxa: 0 });
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 0 });
    const [dataUpdateId, setDataUpdateId] = useState<string>('');
    const [filter, setFilter] = useState({ limit: 100, page: 1, specieId: '', subSpecieId: '', dateStart: '', dateEnd: '' });

    const submitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            setModalOpen(false);
            toast.success('Peixe atualizado com sucesso.');
            fetchPeixes();

        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao atualizar peixe");
            }
        } finally {
            setLoading(false);
        }
    };

    const submitDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            setModalOpenConfirm(false);
            toast.success('Peixe excluido com sucesso.');
            fetchPeixes();

        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao deletar peixe");
            }
        } finally {
            setLoading(false);
        }
    };

    // const params: GetFishParams = useMemo(() => ({
    //     limit: filter.limit,
    //     page: filter.page,
    //     specieId: filter.specieId,
    //     subSpecieId: filter.subSpecieId,
    //     processId: filter.processId,
    //     boxId: filter.boxId,
    //     dateStart: filter.dateStart,
    //     dateEnd: filter.dateEnd
    // }), [filter]);

    const fetchPeixes = useCallback(async (page: number = 0) => {
        setIsLoading(true);
        try {

            // setPagination({ totalPages: response.totalPages, currentPage: response.page });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setIsLoadingInitial(false);
        }
    }, []);

    // const fetchAllSpecies = useCallback(async () => {
    //     let AllSpecies: GetSpecieResponse['species'] = [];
    //     let page = 1;
    //     let hasMore = true;

    //     while (hasMore) {
    //         const Params: GetSpecieParams = {
    //             limit: 10,
    //             page: page
    //         };
    //         try {
    //             const data = await getSpecies(Params);
    //             AllSpecies = [...AllSpecies, ...data.species];
    //             if (data.species.length < 10) {
    //                 hasMore = false;
    //             } else {
    //                 page += 1;
    //             }
    //         } catch (error) {
    //             hasMore = false;
    //         }
    //     }
    //     setListEspecies(AllSpecies);
    // }, []);



    // const handleRegiterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setDataRegister((prevRegister) => ({
    //         ...prevRegister,
    //         [name]: value,
    //     }));
    // };

    const checkScreenSize = () => {
        setIsSmallScreen(window.innerWidth <= 768);
    };

    const handleSidebarVisibility = () => {
        const shouldShowSidebar = window.innerWidth > 768;
        setIsOpen(shouldShowSidebar);

    }

    useEffect(() => {
        checkScreenSize();
        handleSidebarVisibility();
        const handleResize = () => {
            checkScreenSize();
            handleSidebarVisibility();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const openModalCloseSidebar = () => {
        setIsOpen(false);
        setModalRegister(true);
    };

    const handleNextPage = () => {
        setFilter(prev => ({
            ...prev,
            page: Math.min(prev.page + 1, pagination.totalPages)
        }));
    };

    const handlePreviousPage = () => {
        setFilter(prev => ({
            ...prev,
            page: Math.max(prev.page - 1, 1)
        }));
    };

    const handleFiltrar = () => {
        setFilter((prev) => ({ ...prev, page: 1 }));
        fetchPeixes(0);
    };

    // const handleClick = (fish: PatchFishIdRequest, id: number) => {
    //     setDataUpdateId(String(id));
    //     setDataUpdate({
    //         tag: fish.tag,
    //         color: fish.color,
    //         tailColor: fish.tailColor,
    //         freshness: fish.freshness,
    //         texture: fish.texture,
    //         fat: fish.fat,
    //         weight: fish.weight,
    //         capture: fish.capture,
    //         observation: fish.observation,
    //         specieId: fish.specieId,
    //         subSpecieId: fish.subSpecieId,
    //         boxId: fish.boxId,
    //         processId: fish.processId
    //     })
    //     setModalOpen(true);
    //     setIsOpen(false);
    // }

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin overflow-y-auto  duration-300 ease-in-out ${isSmallScreen ? 'ml-0' : (isOpen ? 'ml-64' : 'ml-0')}`} style={{ width: isOpen ? 'calc(100% - 256px)' : '100%' }}>
                <Header titulo="Painel" isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <div className="flex-col mt-20 sm:mb-0 mb-52">
                    <div className="p-8">
                        {isLoadingInitial === false ? (
                            <Card className=" rounded-xl p-5 ">
                                <div className=''>
                                    <div className='flex justify-center sm:justify-between mb-2 items-end flex-wrap gap-2'>
                                        <h1 className='text-lg font-semibold text-red-500 uppercase'>Peixes em espera</h1>
                                    </div>
                                    <div>
                                        <ScrollArea className="h-full whitespace-nowrap">
                                            <Table style={{ maxWidth: 'calc(100% - 32px)' }}>
                                                <TableHeader>
                                                    {/* <div>Total: {listFishes?.filter(fish => fish.boxId === null).length}</div> */}
                                                    <TableRow>
                                                        <TableHead className='p-2'>Cliente</TableHead>
                                                        <TableHead className='p-2'>Lote</TableHead>
                                                        <TableHead className='p-2'>Espécie</TableHead>
                                                        <TableHead className='p-2'>Subespécie</TableHead>
                                                        <TableHead className='p-2'>Lacre</TableHead>
                                                        <TableHead className='p-2'>Cor</TableHead>
                                                        <TableHead className='p-2'>Cor do rabo</TableHead>
                                                        <TableHead className='p-2'>Frescor</TableHead>
                                                        <TableHead className=' p-2'>Textura</TableHead>
                                                        <TableHead className=' p-2'>Gordura</TableHead>
                                                        <TableHead className=' p-2'>Peso</TableHead>
                                                        <TableHead className=' p-2'>Captura</TableHead>
                                                        <TableHead className=' p-2'>Observação</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {/* {listFishes
                                                        ?.filter(fish => fish.boxId === null).length !== 0 ?
                                                        listFishes
                                                            ?.filter(fish => fish.boxId === null)
                                                            .map((fish, index) => (
                                                                <TableRow key={index} className=''>
                                                                    <TableCell className=' p-2'>{fish.process.customer.name || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.process.batch || '-'}</TableCell>
                                                                    <TableCell className=' p-2 '>{fish.specie?.description || '-'}</TableCell>
                                                                    <TableCell className=' p-2 '>{fish.subSpecie?.description || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.tag || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.color || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.tailColor || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.freshness || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.texture || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.fat || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.weight || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.capture || '-'}</TableCell>
                                                                    <TableCell className=' p-2'>{fish.observation || '-'}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        :
                                                        <TableRow><TableCell colSpan={14}>Nenhum peixe em espera</TableCell></TableRow>
                                                    } */}
                                                </TableBody>
                                            </Table>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                        {/* <div className="flex justify-between items-center mt-4">
                                                                               <div className="flex-1">
                                                                                   <p className="text-sm text-muted-foreground">Página {pagination.currentPage} de {pagination.totalPages}</p>
                                                                               </div>
                                                                               <div className="flex justify-end gap-3">
                                                                                   <Pagination className='gap-8'>
                                                                                       <button onClick={handlePreviousPage} disabled={filter.page === 1 || isLoading}>
                                                                                           <ChevronLeft className='text-slate-500' />
                                                                                       </button>
                                                                                       <button onClick={handleNextPage} disabled={filter.page >= pagination.totalPages || isLoading}>
                                                                                           <ChevronRight className='text-slate-500' />
                                                                                       </button>
                                                                                   </Pagination>
                                                                               </div>
                                                                           </div> */}
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div className="text-center mt-10">
                                <span className="loading loading-dots loading-lg"
                                    style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}></span>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
            {modalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <form onSubmit={submitUpdate} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-3xl w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-0 sm:h-10 sm:w-10">
                                                <Fish className="h-6 w-6" style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Editar Peixe
                                            </h3>
                                        </div>
                                        <div className="mt-3  sm:mt-0 sm:ml-4  ">
                                            <div className="mt-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    <div>
                                                        <Label htmlFor='tag'>Número do lacre</Label>
                                                        <Input
                                                            type="text"
                                                            id="tag"
                                                            name="tag"
                                                            // value={dataUpdate.tag}
                                                            // onChange={handleChange}
                                                            placeholder='Digite o lacre'
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='color'>Cor</Label>
                                                        <Input
                                                            type="text"
                                                            id="color"
                                                            name="color"
                                                            // value={dataUpdate.color}
                                                            // onChange={handleChange}
                                                            placeholder='Digite a cor'
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='tailColor'>Cor do rabo</Label>
                                                        <Input
                                                            type="text"
                                                            id="tailColor"
                                                            name="tailColor"
                                                            // value={dataUpdate.tailColor}
                                                            // onChange={handleChange}
                                                            placeholder='Digite a cor do rabo'
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='freshness'>Frescor</Label>
                                                        <Input
                                                            type="text"
                                                            id="freshness"
                                                            name="freshness"
                                                            // value={dataUpdate.freshness}
                                                            // onChange={handleChange}
                                                            placeholder='Digite o frescor'
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='texture'>Textura</Label>
                                                        <Input
                                                            type="text"
                                                            id="texture"
                                                            name="texture"
                                                            // value={dataUpdate.texture}
                                                            // onChange={handleChange}
                                                            placeholder='Digite a textura'
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='fat'>Gordura</Label>
                                                        <Input
                                                            type="text"
                                                            id="fat"
                                                            name="fat"
                                                            // value={dataUpdate.fat}
                                                            // onChange={handleChange}
                                                            placeholder='Digite a Gordura'
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='fat'>Peso*</Label>
                                                        <Input
                                                            type="number"
                                                            id="weight"
                                                            name="weight"
                                                            // value={dataUpdate.weight}
                                                            // onChange={handleChange}
                                                            placeholder='Digite o peso'
                                                            required
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor='capture'>Captura*</Label>
                                                        <Input
                                                            type="text"
                                                            id="capture"
                                                            name="capture"
                                                            // value={dataUpdate.capture}
                                                            // onChange={handleChange}
                                                            placeholder='Digite a captura'
                                                            required
                                                            style={{ fontSize: '16px' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor='capture'>Observação</Label>
                                                    <Textarea
                                                        rows={3}
                                                        id="observation"
                                                        name="observation"
                                                        // value={dataUpdate.observation}
                                                        // onChange={handleChange}
                                                        placeholder='Digite a observação'
                                                        style={{ fontSize: '16px' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-2">
                                <Button
                                    style={{
                                        backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA
                                    }}
                                    type='submit'
                                >
                                    {loading ? <span className="loading loading-spinner loading-xs"></span>
                                        : 'Salvar'}
                                </Button>
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    variant={"secondary"}
                                    className='border border-gray-400'
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
            {
                modalOpenConfirm && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <form onSubmit={submitDelete} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
                                <ScrollArea>
                                    <div className="bg-white px-4 pt-5 pb-4 ">
                                        <div className="">
                                            <div className='flex items-center gap-2'>
                                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-0 sm:h-10 sm:w-10">
                                                    <Fish className="h-6 w-6" style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                                </div>
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                    Excluir Peixe
                                                </h3>
                                            </div>
                                            <div className="mt-3  sm:mt-0 sm:ml-4  ">
                                                <h1>Tem certeza que deseja excluir este peixe?</h1>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-2">
                                    <Button
                                        style={{
                                            backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA
                                        }}
                                        type='submit'
                                    >
                                        {loading ? <span className="loading loading-spinner loading-xs"></span>
                                            : 'Confirmar'}
                                    </Button>
                                    <Button
                                        onClick={() => setModalOpenConfirm(false)}
                                        variant={"secondary"}
                                        className='border border-gray-400'
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}