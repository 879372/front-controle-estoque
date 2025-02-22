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
import { createRequest, CreateRequest } from '@/api/axios/pedidos/createRequest';
import { patchRequestId, PatchRequestIdRequest } from '@/api/axios/pedidos/patchRequestId';
import { deleteRequestId } from '@/api/axios/pedidos/deleteRequestId';
import { getRequest, GetRequestParams, GetRequestResponse } from '@/api/axios/pedidos/getRequest';
import { GetProductParams } from '@/api/axios/produtos/getProduct';
import Link from 'next/link';
import { GetRequestIdResponse } from '@/api/axios/pedidos/getRequestId';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatCurrencyBRL = (value: number | string): string => {
    if (value === null || value === undefined) return '-';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '-';

    return numberValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export default function Pedidos() {
    const [isOpen, setIsOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [filter, setFilter] = useState<GetProductParams>({ limit: 10, page: 1, search: '', startDate: '', endDate: '', status: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalCancel, setModalCancel] = useState<boolean>(false);
    const [modalRegister, setModalRegister] = useState<boolean>(false);
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [dataRegister, setDataRegister] = useState<CreateRequest>({ clienteId: 0, itensPedido: [], status: 'PENDENTE' });
    const [dataUpdate, setDataUpdate] = useState<PatchRequestIdRequest>({ status: 'CANCELADO' });
    const [dataUpdateId, setDataUpdateId] = useState<string>('');
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 0 });
    const [listRequest, setListRequest] = useState<GetRequestResponse['pedidos']>();
    const [requestInfo, setRequestInfo] = useState<GetRequestIdResponse>();

    const submitDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await deleteRequestId(dataUpdateId);
            toast.success('Pedido excluido com sucesso.');
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
            const response = await patchRequestId(dataUpdate, dataUpdateId);
            setModalCancel(false);
            toast.success('Pedido cancelado com sucesso.');
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

    const params: GetRequestParams = useMemo(() => ({
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
            const response = await getRequest(params);
            console.log(response)
            setListRequest(response.pedidos);
            setPagination({ totalPages: response.totalPages, currentPage: response.page });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setIsLoadingInitial(false);
        }
    }, [params]);

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
            status: client.status,
        })
        setRequestInfo(client);
        setModalOpen(true);
    }

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin overflow-y-auto  duration-300 ease-in-out ${isSmallScreen ? 'ml-0' : (isOpen ? 'ml-64' : 'ml-0')}`} style={{ width: isOpen ? 'calc(100% - 256px)' : '100%' }}>
                <Header titulo="Pedidos" isOpen={isOpen} toggleSidebar={toggleSidebar} />
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
                                                    onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
                                                />
                                            </div>
                                            <div>
                                                <Label className='text-xs'>Data Fim:</Label>
                                                <Input
                                                    className='text-xs max-h-8 max-w-[140px]'
                                                    type="date"
                                                    value={filter.endDate}
                                                    onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
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
                                            <Link href={'/pedidos/criar'}>
                                                <Button
                                                    className="max-h-8 sm:max-w-[130px] w-full rounded text-xs"
                                                    style={{ backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}
                                                >
                                                    Criar novo Pedido
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div>
                                        <ScrollArea className="h-full whitespace-nowrap">
                                            <Table style={{ maxWidth: 'calc(100% - 32px)' }}>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className='p-2'>Nome</TableHead>
                                                        <TableHead className='p-2'>Quantidade</TableHead>
                                                        <TableHead className='p-2'>Valor</TableHead>
                                                        <TableHead className='p-2'>Status</TableHead>
                                                        <TableHead className='p-2'>Criação</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {
                                                        listRequest?.map((client, index) => (
                                                            <TableRow key={index} className='text-md'>
                                                                <TableCell className='p-2'>{client.cliente.nome || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.quantidade_total || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.valor_total || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.status || '-'}</TableCell>
                                                                <TableCell className='p-2'>{client.data_pedido ? new Date(client.data_pedido).toLocaleString('pt-BR', { timeZone: 'UTC' }) : '-'}</TableCell>
                                                                <TableCell className='flex gap-2 items-center justify-center p-1'>
                                                                    <button title='Editar' onClick={() => handleClick(client, String(client.id_pedido))} className='bg-transparent'>
                                                                        <Edit size={18} />
                                                                    </button>
                                                                    <button title='Excluir' onClick={() => { setDataUpdateId(String(client.id_pedido)); setModalDelete(true) }} className='bg-transparent'>
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
            {modalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-3xl w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <Users style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Pedido {requestInfo?.cliente.nome}
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <ScrollArea className="h-72 whitespace-nowrap w-full">
                                                    <table className='w-full'>
                                                        <thead className='bg-white sticky top-0 z-10 whitespace-nowrap'>
                                                            <tr className='text-sm'>
                                                                <th className="p-2 font-medium text-start">Código</th>
                                                                <th className="p-2 font-medium text-start">Nome</th>
                                                                <th className="p-2 font-medium text-start">Valor</th>
                                                                <th className="p-2 font-medium text-start">Quantidade</th>
                                                                <th className="p-2 font-medium text-start">Valor Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                requestInfo?.itensPedido.map((client, index) => (
                                                                    <tr key={index} className='odd:bg-gray-50 even:bg-white text-sm'>
                                                                        <td className='border-t p-2 text-gray-700'>{client.produto.id_produto || '-'}</td>
                                                                        <td className='border-t p-2 text-gray-700'>{client.produto.descricao || '-'}</td>
                                                                        <td className='border-t p-2 text-gray-700'>{formatCurrencyBRL(client.preco_unitario) || '-'}</td>
                                                                        <td className='border-t p-2 text-gray-700'>{client.quantidade || '-'}</td>
                                                                        <td className='border-t p-2 text-gray-700'>{Number(client.preco_unitario) * Number(client.quantidade) || '-'}</td>

                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                                <div className='flex gap-2 items-center'>
                                                    <div className='flex relative h-10 tex-sm font-semibold '>
                                                        <div className='flex justify-center items-center  border h-full w-32'>
                                                            <p className='bg-white absolute -top-2 left-2 text-sm'>Valor Total</p>
                                                            <h2 className='text-lg'>
                                                                {formatCurrencyBRL(Number(requestInfo?.valor_total))}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className='flex relative h-10 tex-sm font-semibold '>
                                                        <div className='flex justify-center items-center  border h-full w-32'>
                                                            <p className='bg-white absolute -top-2 left-2 text-sm'>Quantidade</p>
                                                            <h2 className='text-lg'>
                                                                {requestInfo?.quantidade_total}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Button
                                                        onClick={()=> setModalCancel(true)}
                                                        className='bg-red-500 '>
                                                            Cancelar Pedido
                                                        </Button>
                                                    </div>
    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-2">
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    variant={"secondary"}
                                    className='border border-gray-400'
                                >
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalCancel && (
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
                                                Excluir pedido
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <h1>Tem certeza que deseja excuir esse pedido?</h1>
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
                                    onClick={() => setModalCancel(false)}
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
                                                Cancelar pedido
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <h1>Tem certeza que deseja cancelar esse pedido?</h1>
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