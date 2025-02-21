'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Edit, LayoutList, Users, X } from 'lucide-react';;
import { toast } from 'react-toastify';
import Sidebar from '@/components/sidebar/sidebar';
import Header from '@/components/header/header';
import { patchProductId, PatchProductIdRequest } from '@/api/axios/produtos/patchProductId';
import { deleteProductId } from '@/api/axios/produtos/deleteProductId';
import { GetProductParams, GetProductResponse, getProducts } from '@/api/axios/produtos/getProduct';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetClientParams, GetClientResponse, getClients } from '@/api/axios/clientes/getClient';
import { CreateRequest, createRequest } from '@/api/axios/pedidos/createRequest';
import { useRouter } from 'next/navigation';

interface AddProduct {
    produtos: {
        id_produto: number;
        nome: string;
        descricao: string;
        preco: number;
        estoque: number;
        quantidade: number;
        data_cadastro: string;
        data_validade: string;
    }[]
}

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

export default function CriarPedidos() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [filter, setFilter] = useState<GetProductParams>({ limit: 10, page: 1, search: '', startDate: '', endDate: '', status: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [dataRegister, setDataRegister] = useState<CreateRequest>({ clienteId: 0, itensPedido: [], status: 'PENDENTE' });
    const [dataUpdateId, setDataUpdateId] = useState<string>('');
    const [listProducts, setListProducts] = useState<GetProductResponse['produto']>([]);
    const [listProductsAdd, setListProductsAdd] = useState<AddProduct['produtos']>([]);
    const [listClients, setListClients] = useState<GetClientResponse['clientes']>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [idClient, setIdClient] = useState<string>()
    const router = useRouter();

    const AddParamsProduct = () => {
        setDataRegister((prev) => ({
            ...prev,
            itensPedido: listProductsAdd.map((prod) => ({
                produtoId: prod.id_produto,
                quantidade: prod.quantidade
            })),
            status: 'APROVADO'
        }));
        setModalOpen(true);
    };
    

    const submitRegister = async () => {
        setLoading(true);
        try {
            const response = await createRequest({ ...dataRegister, clienteId: Number(idClient) });
            console.log(response)
            console.log(dataRegister)
            toast.success('Pedido criado com sucesso.');
            setModalOpen(false);
            router.push('/pedidos')
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
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [params]);


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
            } finally {
                setIsLoadingInitial(false);
            }
        }
        setListClients(allEmpresas);

    }, [filter]);

    useEffect(() => {
        fetchClients();
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setFilter(prev => ({ ...prev, search: searchTerm }));
        fetchProduct();
        console.log(searchTerm)
        if (searchTerm === '') {
            setListProducts([])
        }
    };

    const handleQuantityChange = (id_produto: number, change: number) => {
        setListProductsAdd((prev) =>
            prev.map((product) => {
                if (product.id_produto === id_produto) {
                    const newQuantity = Math.max(1, Math.min(product.quantidade + change, product.estoque));
                    return {
                        ...product,
                        quantidade: newQuantity,
                        // estoque: product.estoque - (newQuantity - product.quantidade), // Deduz estoque 
                    };
                }
                return product;
            })
        );
    };

    console.log(listProductsAdd)

    const handleClickAdd = async (produto: any) => {
        setListProductsAdd((prev) => [
            ...prev,
            {
                id_produto: produto.id_produto,
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
                estoque: produto.estoque,
                data_cadastro: produto.data_cadastro,
                data_validade: produto.data_validade,
                quantidade: 1
            }
        ]);
    };


    const handleKeyDown = (e: any) => {
        if (!filter.search || listProducts.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % listProducts.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + listProducts.length) % listProducts.length);
        } else if (e.key === "Enter" && selectedIndex !== -1) {
            e.preventDefault();
            handleClickAdd(listProducts[selectedIndex]);
            setFilter((prev) => ({
                ...prev,
                search: ''
            }));
        }
    };

    useEffect(() => {
        document.getElementById("searchInput")?.addEventListener("keydown", handleKeyDown);
        return () => {
            document.getElementById("searchInput")?.removeEventListener("keydown", handleKeyDown);
        };
    }, [listProducts, selectedIndex]);

    const handleRemoveProduct = (id_produto: number) => {
        setListProductsAdd((prev) => prev.filter(product => product.id_produto !== id_produto));
        setModalDelete(false);
    };

    const valorTotal = listProductsAdd.reduce((acc, prod) => acc + prod.preco * prod.quantidade, 0);
    const quantidadeTotal = listProductsAdd.reduce((acc, prod) => acc + prod.quantidade, 0);


    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin overflow-y-auto  duration-300 ease-in-out ${isSmallScreen ? 'ml-0' : (isOpen ? 'ml-64' : 'ml-0')}`} style={{ width: isOpen ? 'calc(100% - 256px)' : '100%' }}>
                <Header titulo="Novo pedido" isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <div className="flex-col mt-20 sm:mb-0 mb-52">
                    <div className="p-8">
                        {isLoadingInitial === false ? (
                            <Card className="h-[80vh] rounded-xl p-5 ">
                                <div className='h-full'>
                                    <div className='flex justify-center sm:justify-between mb-2 items-end flex-wrap gap-2'>
                                        <div className='flex items-center gap-2 flex-wrap w-full'>
                                            <div className='flex items-center gap-2 w-full relative'>
                                                <Input
                                                    id="searchInput"
                                                    value={filter.search}
                                                    onChange={handleSearchChange}
                                                    className='h-12 w-full semibold'
                                                    style={{ borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA, fontSize: '20px', fontWeight: '400' }}
                                                    placeholder='Pesquise o produto'
                                                    required
                                                />
                                                {filter.search && (
                                                    <div className="absolute z-50 w-full bg-slate-200 shadow-lg border mt-1 rounded-lg max-h-60 overflow-auto top-12">
                                                        {isLoading ? (
                                                            <p className="p-2 text-gray-500">Pesquisando...</p>
                                                        ) : listProducts.length > 0 ? (
                                                            listProducts.map((product, index) => (
                                                                <div
                                                                    key={product.id_produto}
                                                                    tabIndex={0}
                                                                    onClick={() => {
                                                                        // setDataRegister((prev) => ({
                                                                        //     ...prev,
                                                                        //     itensPedido: [
                                                                        //         ...prev.itensPedido,
                                                                        //         {
                                                                        //             produtoId: product.id_produto,
                                                                        //             quantidade: "1", 
                                                                        //         },                                                                            ],
                                                                        // }));
                                                                        setFilter((prev) => ({
                                                                            ...prev,
                                                                            search: ''
                                                                        }));
                                                                        handleClickAdd(product);
                                                                    }}
                                                                    className={`p-3 border-b last:border-none cursor-pointer hover:bg-gray-100 w-full bg-slate-200 ${selectedIndex === index ? "bg-gray-300" : ""
                                                                        }`}
                                                                >
                                                                    {product.nome}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="p-2 text-gray-500">Nenhum produto encontrado.</p>
                                                        )}
                                                    </div>
                                                )}
                                                <Select required onValueChange={(e) => setIdClient(e)}>
                                                    <SelectTrigger className="w-full h-12 text-lg semibold" style={{ borderColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA }}>
                                                        <SelectValue placeholder={'Selecione o cliente'} />
                                                    </SelectTrigger>
                                                    <SelectContent className='text-lg semibold'>
                                                        {listClients?.map((client, index) => (
                                                            <SelectItem key={index} value={String(client.id_cliente)}>{client.nome}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button className="h-12 rounded text-lg"
                                                    style={{ backgroundColor: process.env.NEXT_PUBLIC_COR_SECUNDARIA, height: '100%' }}
                                                    onClick={AddParamsProduct}
                                                >
                                                    {isLoading ? <span className="loading loading-spinner loading-xs"></span>
                                                        : 'FINALIZAR'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-between gap-5 w-full h-full'>
                                        <ScrollArea className="h-72 whitespace-nowrap w-full">
                                            <table className='w-full'>
                                                <thead className='bg-white sticky top-0 z-10 whitespace-nowrap'>
                                                    <tr className='text-sm'>
                                                        <th className="p-2 font-medium text-start">Nome</th>
                                                        <th className="p-2 font-medium text-start">Descrição</th>
                                                        <th className="p-2 font-medium text-start">Valor</th>
                                                        <th className="p-2 font-medium text-start">Estoque</th>
                                                        <th className="p-2 font-medium text-start">Validade</th>
                                                        <th className="p-2 font-medium text-start">Quantidade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        listProductsAdd?.map((client, index) => (
                                                            <tr key={index} className='odd:bg-gray-50 even:bg-white text-sm'>
                                                                <td className='border-t p-2 text-gray-700'>{client.nome || '-'}</td>
                                                                <td className='border-t p-2 text-gray-700'>{client.descricao || '-'}</td>
                                                                <td className='border-t p-2 text-gray-700'>{formatCurrencyBRL(client.preco) || '-'}</td>
                                                                <td className='border-t p-2 text-gray-700'>{client.estoque || '-'}</td>
                                                                <td className='border-t p-2 text-gray-700'>{client.data_validade ? new Date(client.data_cadastro).toLocaleString('pt-BR', { timeZone: 'UTC' }) : '-'}</td>
                                                                <td className="border-t p-2 text-gray-700">
                                                                    <div className='flex items-center
                                                                    gap-2'>
                                                                        <button
                                                                            className="bg-gray-200 px-2 py-1 rounded"
                                                                            onClick={() => handleQuantityChange(client.id_produto, -1)}
                                                                            disabled={client.quantidade <= 1}
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span className="w-10 text-center">{client.quantidade}</span>
                                                                        <button
                                                                            className="bg-gray-200 px-2 py-1 rounded"
                                                                            onClick={() => handleQuantityChange(client.id_produto, 1)}
                                                                            disabled={client.quantidade >= client.estoque}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="border-t p-2 text-gray-700">
                                                                    <button title='Excluir' onClick={() => { setDataUpdateId(String(client.id_produto)); setModalDelete(true) }} className='bg-transparent'>
                                                                        <X className='text-red-500' size={20} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                        <div className='flex gap-2 items-center pb-14'>
                                            <div className='flex relative h-20 tex-2xl font-bold '>
                                                <div className='flex justify-center items-center  border h-full w-32'>
                                                    <p className='bg-white absolute -top-3 left-2'>Valor Total</p>
                                                    <h2 className='text-2xl'>
                                                        {formatCurrencyBRL(valorTotal)}
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className='flex relative h-20 tex-2xl font-bold '>
                                                <div className='flex justify-center items-center  border h-full w-32'>
                                                    <p className='bg-white absolute -top-3 left-2'>Quantidade</p>
                                                    <h2 className='text-2xl'>
                                                        {quantidadeTotal}
                                                    </h2>
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
            {modalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center sm:items-start sm:justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
                            <ScrollArea>
                                <div className="bg-white px-4 pt-5 pb-4 ">
                                    <div className="">
                                        <div className='flex items-center gap-2'>
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 mx-0 sm:h-10 sm:w-10">
                                                <LayoutList style={{ color: process.env.NEXT_PUBLIC_COR_SECUNDARIA }} aria-hidden="true" />
                                            </div>
                                            <h3 className="text-lg leading-6 font-medium" id="modal-title">
                                                Finalizar pedido
                                            </h3>
                                        </div>
                                        <div className="mt-3sm:mt-0">
                                            <div className="mt-5">
                                                <div >
                                                    <h1>Tem certeza que deseja finalizar esse pedido?</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex gap-2">
                                <Button
                                    style={{
                                        backgroundColor: process.env.NEXT_PUBLIC_COR_PRINCIPAL
                                    }}
                                    onClick={submitRegister}
                                >
                                    {loading ? <span className="loading loading-spinner loading-xs"></span>
                                        : 'Confirma'}
                                </Button>
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    variant={"secondary"}
                                    className='border border-gray-400'
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
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
                                                    <h1>Tem certeza que deseja excluir esse produto do pedido?</h1>
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
                                    onClick={() => handleRemoveProduct(Number(dataUpdateId))}
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}