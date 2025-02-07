'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Edit, Users, X } from 'lucide-react';;
import { toast } from 'react-toastify';
import Sidebar from '@/components/sidebar/sidebar';
import Header from '@/components/header/header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { createProduct, CreateProduct } from '@/api/axios/produtos/createProduct';
import { patchProductId, PatchProductIdRequest } from '@/api/axios/produtos/patchProductId';
import { deleteProductId } from '@/api/axios/produtos/deleteProductId';
import { GetProductParams, GetProductResponse, getProducts } from '@/api/axios/produtos/getProduct';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetClientParams, GetClientResponse, getClients } from '@/api/axios/clientes/getClient';

export default function Produtos() {
    const [isOpen, setIsOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [filter, setFilter] = useState<GetProductParams>({ limit: 10, page: 1, search: '', startDate: '', endDate: '', status: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalRegister, setModalRegister] = useState<boolean>(false);
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [dataRegister, setDataRegister] = useState<CreateProduct>({ nome: '', descricao: '', estoque: 0, preco: 0, data_validade: '' });
    const [dataUpdate, setDataUpdate] = useState<PatchProductIdRequest>({ nome: '', descricao: '', estoque: 0, preco: 0, data_validade: '' });
    const [dataUpdateId, setDataUpdateId] = useState<string>('');
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 0 });
    const [listProducts, setListProducts] = useState<GetProductResponse['produto']>();
    const [listClients, setListClients] = useState<GetClientResponse['clientes']>();
    const [nameClient, setNameClient] = useState<string>()
    const [idClient, setIdClient] = useState<string>()

    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createProduct(dataRegister);
            console.log(response)
            console.log(dataRegister)
            toast.success('Produto criado com sucesso.');
            fetchProduct();
            setModalRegister(false);
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao criar produto");
            }
        } finally {
            setLoading(false);
        }
    };

    const submitDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await deleteProductId(dataUpdateId);
            toast.success('Produto excluido com sucesso.');
            fetchProduct();
            setModalDelete(false);
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao criar produto");
            }
        } finally {
            setLoading(false);
        }
    };

    const submitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await patchProductId(dataUpdate, dataUpdateId);
            setModalOpen(false);
            toast.success('Produto atualizado com sucesso.');
            fetchProduct();
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Erro ao atualizar produto");
            }
        } finally {
            setLoading(false);
        }
    };

    const params: GetProductParams = useMemo(() => ({
        limit: filter.limit,
        page: filter.page,
        endDate: filter.endDate,
        startDate: filter.startDate,
        search: filter.search,
        status: filter.status
    }), [filter]);

    const fetchProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProducts(params);
            setListProducts(response.produto);
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
            [name]: name === 'preco' || name === 'estoque' ? Number(value) : value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataUpdate((prevRegister) => ({
            ...prevRegister,
            [name]: name === 'preco' || name === 'estoque' ? Number(value) : value,
        }));
    };

    useEffect(() => {
        fetchProduct();
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
        fetchProduct();
    };

    const handleClick = (client: any, id: string) => {
        setDataUpdateId(id);
        setDataUpdate({
            nome: client.nome,
            descricao: client.descricao,
            data_validade: client.data_validade,
            estoque: client.estoque,
            preco: client.preco
        })
        setModalOpen(true);
    }

    const fetchClients = useCallback(async () => {
        let allEmpresas: GetClientResponse['clientes'] = [];
        let page = 0;
        let hasMore = true;

        while (hasMore) {
            const params: GetClientParams = {
                limit: filter.limit,
                page: filter.page
            };
            try {
                const data = await getClients(params);
                allEmpresas = [...allEmpresas, ...data.clientes];
                if (data.clientes.length < 50) {
                    hasMore = false;
                } else {
                    page += 1;
                }
            } catch (error) {
                console.log(error)
            }
        }
        setListClients(allEmpresas);

    }, [filter]);

    useEffect(() => {
        fetchClients();
    }, [])

    const handleValueChange = (id: string) => {
        const selectedEmp = listClients?.find(emp => String(emp.id_cliente) === id);
        setIdClient(id)
        if (selectedEmp) {
            setNameClient(selectedEmp.nome);
        }

    };

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin overflow-y-auto  duration-300 ease-in-out ${isSmallScreen ? 'ml-0' : (isOpen ? 'ml-64' : 'ml-0')}`} style={{ width: isOpen ? 'calc(100% - 256px)' : '100%' }}>
                <Header titulo="Novo pedido" isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <div className="flex-col mt-20 sm:mb-0 mb-52">
                    <div className="p-8">
                        {isLoadingInitial === false ? (
                            <Card className="h-[80vh] rounded-xl p-5 ">
                                <div className=''>
                                    <div className='flex justify-center sm:justify-between mb-2 items-end flex-wrap gap-2'>
                                        <div className='flex items-center gap-2 flex-wrap w-full'>
                                            <div className='flex items-center gap-2 w-full'>
                                                <Input
                                                    value={filter.search}
                                                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                                                    className='h-12 w-full semibold'
                                                    style={{ borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA, fontSize: '20px', fontWeight: '400' }}
                                                    placeholder='Pesquise o produto'
                                                    required
                                                />
                                                <Select required onValueChange={handleValueChange}>
                                                    <SelectTrigger className="w-full h-12 text-lg semibold" style={{ borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                                                        <SelectValue placeholder={nameClient ?? 'Selecione o cliente'} />
                                                    </SelectTrigger>
                                                    <SelectContent className='text-lg semibold'>
                                                        {listClients?.map((client, index) => (
                                                            <SelectItem key={index} value={String(client.id_cliente)}>{client.nome}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button className="h-12 rounded text-lg"
                                                    style={{ backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA, height: '100%' }}
                                                    onClick={handleFiltrar}
                                                >
                                                    {isLoading ? <span className="loading loading-spinner loading-xs"></span>
                                                        : 'FINALIZAR'}
                                                </Button>
                                            </div>
                                            <div className='self-end'>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between gap-5'>
                                        <ScrollArea className="h-72 whitespace-nowrap">
                                            <Table style={{ maxWidth: 'calc(100% - 32px)' }}>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className='p-2'>Nome</TableHead>
                                                        <TableHead className='p-2'>Descrição</TableHead>
                                                        <TableHead className='p-2'>Valor</TableHead>
                                                        <TableHead className='p-2'>Estoque</TableHead>
                                                        <TableHead className='p-2'>Validade</TableHead>
                                                        <TableHead className='p-2'>Criação</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {
                                                        listProducts?.map((client, index) => (
                                                            <TableRow key={index} className='text-md'>
                                                                <TableCell className='p-2'>{client.nome || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.descricao || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.preco || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.estoque || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.data_validade ? new Date(client.data_cadastro).toLocaleString('pt-BR', { timeZone: 'UTC' }) : '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.data_cadastro ? new Date(client.data_cadastro).toLocaleString('pt-BR', { timeZone: 'UTC' }) : '-'}</TableCell>
                                                                <TableCell className='flex gap-2 items-center justify-center p-1'>
                                                                    <button title='Editar' onClick={() => handleClick(client, String(client.id_produto))} className='bg-transparent'>
                                                                        <Edit size={18} />
                                                                    </button>
                                                                    <button title='Excluir' onClick={() => { setDataUpdateId(String(client.id_produto)); setModalDelete(true) }} className='bg-transparent'>
                                                                        <X className='text-red-500' size={20} />
                                                                    </button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                        <div className='flex gap-2'>
                                            <div className='flex relative h-20 tex-2xl font-bold '>
                                                <div className='flex justify-center items-center  border h-full w-32'>
                                                    <p className='bg-white absolute -top-3 left-2'>Valor Total</p>
                                                    <h2 className='text-2xl'>R$ 10,00</h2>
                                                </div>
                                            </div>
                                            <div className='flex relative h-20 tex-2xl font-bold '>
                                                <div className='flex justify-center items-center  border h-full w-32'>
                                                    <p className='bg-white absolute -top-3 left-2'>Quantidade</p>
                                                    <h2 className='text-2xl'>67</h2>
                                                </div>
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
                        <form onSubmit={submitRegister} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl lg:max-w-3xl w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <Users style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Cadastrar Produto
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <div className="grid grid-cols-2 gap-2">
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
                                                            <Label htmlFor='descricao'>Descrição*</Label>
                                                            <Input
                                                                type="text"
                                                                id="descricao"
                                                                name="descricao"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite a descrição'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='preco'>Valor*</Label>
                                                            <Input
                                                                type="number"
                                                                id="preco"
                                                                name="preco"
                                                                step={"0.1"}
                                                                required
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite o valor'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='estoque'>Estoque*</Label>
                                                            <Input
                                                                type="text"
                                                                id="estoque"
                                                                required
                                                                name="estoque"
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite o estoque'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='data_validade'>Validade*</Label>
                                                            <Input
                                                                type="date"
                                                                id="data_validade"
                                                                name="data_validade"
                                                                required
                                                                onChange={handleRegiterChange}
                                                                placeholder='Digite a validade'
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
                        <form onSubmit={submitUpdate} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-3xl w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <Users style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Editar Produto
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <Label htmlFor='nome'>Nome</Label>
                                                            <Input
                                                                type="text"
                                                                id="nome"
                                                                name="nome"
                                                                value={dataUpdate.nome}
                                                                onChange={handleChange}
                                                                placeholder='Digite o nome'
                                                                required
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div className='w-full'>
                                                            <Label htmlFor='descricao'>Descrição</Label>
                                                            <Input
                                                                type="text"
                                                                id="descricao"
                                                                name="descricao"
                                                                value={dataUpdate.descricao}
                                                                onChange={handleChange}
                                                                placeholder='Digite a descrição'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='preco'>Valor</Label>
                                                            <Input
                                                                type="number"
                                                                id="preco"
                                                                name="preco"
                                                                value={dataUpdate.preco}
                                                                onChange={handleChange}
                                                                placeholder='Digite o valor'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='estoque'>Estoque</Label>
                                                            <Input
                                                                type="text"
                                                                id="estoque"
                                                                name="estoque"
                                                                value={dataUpdate.estoque}
                                                                onChange={handleChange}
                                                                placeholder='Digite o estoque'
                                                                style={{ fontSize: '16px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor='data_validade'>Validade</Label>
                                                            <Input
                                                                type="date"
                                                                id="data_validade"
                                                                name="data_validade"
                                                                value={dataUpdate.data_validade}
                                                                onChange={handleChange}
                                                                placeholder='Digite a validade'
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
            {modalDelete && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
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
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <Users style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Excluir produto
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <h1>Tem certeza que deseja excuir esse produto?</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-2">
                                <Button
                                    style={{
                                        backgroundColor: 'red'
                                    }}
                                    type='submit'
                                >
                                    {loading ? <span className="loading loading-spinner loading-xs"></span>
                                        : 'Confirma'}
                                </Button>
                                <Button
                                    onClick={() => setModalDelete(false)}
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