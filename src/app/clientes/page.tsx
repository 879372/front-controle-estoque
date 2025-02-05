'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Box, ChevronLeft, ChevronRight, Edit, Users } from 'lucide-react';;
import { useRouter } from 'next/navigation';
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
import { createClient, CreateClient } from '@/api/axios/clientes/createClient';
import { GetClientParams, GetClientResponse, getClients } from '@/api/axios/clientes/getClient';
import { patchClientId, PatchClientsIdRequest } from '@/api/axios/clientes/patchClientId';

export default function Clientes() {
    const [isOpen, setIsOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [filter, setFilter] = useState<GetClientParams>({ limit: 10, page: 1, search: '', startDate: '', endDate: '', status:'' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalOpenProfileBox, setModalOpenProfileBox] = useState<boolean>(false);
    const [modalRegister, setModalRegister] = useState<boolean>(false);
    const [dataRegister, setDataRegister] = useState<CreateClient>({ nome: '', email: '', bairro: '', cep: '', cidade: '', endereco: '', estado: '', telefone: ''});
    const [dataRegisterProfileBox, setDataRegisterProfileBox] = useState({ description: '', weightLiquidMin: 0, weightLiquidMax: 0, additionalWeight: 0, quantity: 0, active: true, order: 0, customerId: 0 });
    const [dataUpdate, setDataUpdate] = useState<PatchClientsIdRequest>({ name: '', username: '', additionalStandardGrossWeight: 0, password: '' });
    const [dataUpdateId, setDataUpdateId] = useState<string>('');
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 0 });
    const [listClients, setListClients] = useState<GetClientResponse['clientes']>();
    const router = useRouter();

    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createClient(dataRegister);
            toast.success('Cliente criado com sucesso.');
            fetchCliets();
            setModalRegister(false);
            console.log(response)
            console.log(dataRegister)
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao criar caixa");
            }
        } finally {
            setLoading(false);
        }
    };
    
    const submitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await patchClientId(dataUpdate, dataUpdateId);
            setModalOpen(false);
            toast.success('Cliente atualizado com sucesso.');
            fetchCliets();
            console.log(response)
            console.log(dataUpdateId)
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao atualizar processo");
            }
        } finally {
            setLoading(false);
        }
    };

    const params: GetClientParams = useMemo(() => ({
        limit: filter.limit,
        page: filter.page,
        endDate: filter.endDate,
        startDate: filter.startDate,
        search: filter.search,
        status: filter.status
    }), [filter]);

    const fetchCliets = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getClients(params);
            console.log(response);
            console.log(params);
            setListClients(response.clientes);
            setPagination({ totalPages: response.totalPages, currentPage: response.page });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setIsLoadingInitial(false);
        }
    }, [params]);

    const handleRegiterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataRegister((prevRegister) => ({
            ...prevRegister,
            [name]: name === 'additionalStandardGrossWeight' ? Number(value) : value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataUpdate((prevRegister) => ({
            ...prevRegister,
            [name]: name === 'additionalStandardGrossWeight' ? Number(value) : value,
        }));
    };
    const handleChangeProfileBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setDataRegisterProfileBox((prevRegister) => ({
            ...prevRegister,
            [name]: name === 'weightLiquidMin' || name === 'weightLiquidMax' || name === 'additionalWeight' || name === 'quantity' || name === 'order' ? Number(value) : value,
        }));
    };

    useEffect(() => {
        fetchCliets();
    }, [filter.page]);

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
        fetchCliets();
    };

    const handleClick = (client: any, id: string) => {
        setDataUpdateId(id);
        setDataUpdate({
            name: client.name,
            username: client.username,
            password: '',
            additionalStandardGrossWeight: client.additionalStandardGrossWeight
        })
        setModalOpen(true);
        console.log(client)
    }

    const handleClickProfileBox = (id: string) => {
        setDataUpdateId(id);
        setModalOpenProfileBox(true);
        setIsOpen(false);
    }

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin overflow-y-auto  duration-300 ease-in-out ${isSmallScreen ? 'ml-0' : (isOpen ? 'ml-64' : 'ml-0')}`} style={{ width: isOpen ? 'calc(100% - 256px)' : '100%' }}>
                <Header titulo="Cliente" isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <div className="flex-col mt-20 sm:mb-0 mb-52">
                    <div className="p-8">
                        {isLoadingInitial === false ? (
                            <Card className=" rounded-xl p-5 ">
                                <div className=''>
                                    <div className='flex justify-center sm:justify-between mb-2 items-end flex-wrap gap-2'>
                                        <div className='flex items-center gap-2 flex-wrap'>
                                            <div>
                                                <Label className='text-xs'>Filtrar nome:</Label>
                                                <Input
                                                    value={filter.search}
                                                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                                                    className='h-8 w-[140px]'
                                                    placeholder='Pesquise o nome' />
                                            </div>
                                            <div>
                                                <Label className='text-xs'>Data Início:</Label>
                                                <Input
                                                    className='text-xs max-h-8 max-w-[140px]'
                                                    type="date"
                                                    value={filter.startDate}
                                                    onChange={(e) => setFilter(prev => ({ ...prev, dateStart: e.target.value }))}
                                                />
                                            </div>
                                            <div>
                                                <Label className='text-xs'>Data Fim:</Label>
                                                <Input
                                                    className='text-xs max-h-8 max-w-[140px]'
                                                    type="date"
                                                    value={filter.endDate}
                                                    onChange={(e) => setFilter(prev => ({ ...prev, dateEnd: e.target.value }))}
                                                />
                                            </div>
                                            <div className='self-end'>
                                                <Button className="max-h-8 max-w-[130px] rounded text-xs"
                                                    style={{ backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}
                                                    onClick={handleFiltrar}
                                                >
                                                    {isLoading ? <span className="loading loading-spinner loading-xs"></span>
                                                        : 'Filtrar'}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='sm:w-auto w-full'>
                                            <Button
                                                className="max-h-8 sm:max-w-[130px] w-full rounded text-xs"
                                                onClick={() => openModalCloseSidebar()}
                                                style={{ backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}
                                            >
                                                Criar novo cliente
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <ScrollArea className="h-full whitespace-nowrap">
                                            <Table style={{ maxWidth: 'calc(100% - 32px)' }}>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className='p-2'>Nome</TableHead>
                                                        <TableHead className='p-2'>Email</TableHead>
                                                        <TableHead className='p-2'>Telefone</TableHead>
                                                        <TableHead className='p-2'>Criado em</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {
                                                        listClients?.map((client, index) => (
                                                            <TableRow key={index} className=''>
                                                                <TableCell className='p-2'>{client.nome || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.email || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.telefone || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.data_cadastro ? new Date(client.data_cadastro).toLocaleString('pt-BR', { timeZone: 'UTC' }) : '-'}</TableCell>
                                                                <TableCell className='flex gap-2 items-center justify-center p-1'>
                                                                    <button title='Editar' onClick={() => handleClick(client, String(client.id_cliente))} className='bg-transparent'>
                                                                        <Edit size={18} />
                                                                    </button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                        <div className="flex justify-between items-center mt-4">
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
                                        </div>
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
            {modalRegister && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <form onSubmit={submitRegister} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <Users style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Cadastrar Cliente
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <Label htmlFor='nome'>Nome*</Label>
                                                            <Input
                                                                type="text"
                                                                id="nome"
                                                                name="nome"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite o nome'
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div className='w-full'>
                                                            <Label htmlFor='email' >Email</Label>
                                                            <Input
                                                                type="text"
                                                                id="email"
                                                                name="email"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite o email'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='telefone'>Telefone</Label>
                                                            <Input
                                                                type="number"
                                                                id="telefone"
                                                                name="telefone"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite a senha'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='endereco'>Endereço</Label>
                                                            <Input
                                                                type="text"
                                                                id="endereco"
                                                                name="endereco"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite o endereço'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='bairro'>Bairro</Label>
                                                            <Input
                                                                type="text"
                                                                id="bairro"
                                                                name="bairro"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite o bairro'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='cidade'>Cidade</Label>
                                                            <Input
                                                                type="text"
                                                                id="cidade"
                                                                name="cidade"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite a cidade'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='estado'>Estado</Label>
                                                            <Input
                                                                type="text"
                                                                id="estado"
                                                                name="estado"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite a cidade'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='cep'>CEP</Label>
                                                            <Input
                                                                type="text"
                                                                id="cep"
                                                                name="cep"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite a cidade'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                    </div>
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
                                    onClick={() => setModalRegister(false)}
                                    variant={"secondary"}
                                    className='border border-gray-400'
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {modalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <form onSubmit={submitUpdate} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <Users style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Editar Cliente
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <Label htmlFor='name'>Nome do cliente</Label>
                                                            <Input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                value={dataUpdate.name}
                                                                onChange={handleChange}
                                                                placeholder='Digite o nome'
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div className='w-full'>
                                                            <Label htmlFor='username' >Username do cliente</Label>
                                                            <Input
                                                                type="text"
                                                                id="username"
                                                                name="username"
                                                                value={dataUpdate.username}
                                                                onChange={handleChange}
                                                                placeholder='Digite o username'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='password'>Senha do cliente</Label>
                                                            <Input
                                                                type="password"
                                                                id="password"
                                                                name="password"
                                                                onChange={handleChange}
                                                                placeholder='Digite a senha'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='additionalStandardGrossWeight'>Adicional de Peso Bruto Padrão</Label>
                                                            <Input
                                                                type="number"
                                                                id="additionalStandardGrossWeight"
                                                                name="additionalStandardGrossWeight"
                                                                value={dataUpdate.additionalStandardGrossWeight}
                                                                onChange={handleChange}
                                                                placeholder='Digite o adicional de peso Bruto padrão'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                    </div>
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
            )}
            {modalOpenProfileBox && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <form  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-3xl w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-0 sm:h-10 sm:w-10">
                                                <Box className="h-6 w-6" aria-hidden="true"
                                                    style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Criar perfil de caixa
                                            </h3>
                                        </div>
                                        <div className="mt-3  sm:mt-0   ">
                                            <div className="mt-5">
                                                <div >
                                                    <div className="grid grid-cols-2 gap-2 w-full">
                                                        <div>
                                                            <Label htmlFor='description'>Descrição*</Label>
                                                            <Input
                                                                type="text"
                                                                id="description"
                                                                name="description"
                                                                onChange={handleChangeProfileBox}
                                                                placeholder='Digite a descrição'
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div className='flex gap-2 items-end'>
                                                            <div>
                                                                <Label htmlFor='weightLiquidMin'>Peso mínimo*</Label>
                                                                <Input
                                                                    type="number"
                                                                    id="weightLiquidMin"
                                                                    name="weightLiquidMin"
                                                                    onChange={handleChangeProfileBox}
                                                                    placeholder='Digite o peso mínimo'
                                                                    required
                                                                    style={{ fontSize: '16px' }}
                                                                />
                                                            </div>
                                                            á
                                                            <div>
                                                                <Label htmlFor='weightLiquidMax'>Peso máximo*</Label>
                                                                <Input
                                                                    type="number"
                                                                    id="weightLiquidMax"
                                                                    name="weightLiquidMax"
                                                                    onChange={handleChangeProfileBox}
                                                                    placeholder='Digite o Peso máximo'
                                                                    required
                                                                    style={{ fontSize: '16px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='additionalWeight'>Adicional peso bruto*</Label>
                                                            <Input
                                                                type="number"
                                                                id="additionalWeight"
                                                                name="additionalWeight"
                                                                onChange={handleChangeProfileBox}
                                                                placeholder='Digite o peso bruto adicional'
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='quantity'>Quantidade*</Label>
                                                            <Input
                                                                type="number"
                                                                id="quantity"
                                                                name="quantity"
                                                                onChange={handleChangeProfileBox}
                                                                placeholder='Digite a quantidade'
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <Label>Selecione o status:</Label>
                                                            <Select onValueChange={(value) => setDataRegisterProfileBox({ ...dataRegisterProfileBox, active: value === 'true' ? true : false })}>
                                                                <SelectTrigger className="w-full text-xs uppercase">
                                                                    <SelectValue placeholder="ATIVO" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="true">ATIVO</SelectItem>
                                                                    <SelectItem value="false">INATIVO</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='order'>Ordem*</Label>
                                                            <Input
                                                                type="number"
                                                                id="order"
                                                                name="order"
                                                                onChange={handleChangeProfileBox}
                                                                placeholder='Digite a ordem'
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
                                    onClick={() => setModalOpenProfileBox(false)}
                                    variant={"secondary"}
                                    className='border border-gray-400'
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}