'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { AuthLogin, LoginBody } from "@/api/axios/auth/login";

export default function Home() {
  const { token, setToken, setCompanyId } = useAuth()

  const router = useRouter();
  const [login, setLogin] = useState<LoginBody>({
    email:'',
    password:''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [visualizaSenha, setVisualizaSenha] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value.trim();
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: cleanedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await AuthLogin(login);
      console.log(response.acessToken)
      setToken(response.acessToken);
      console.log(login)
      router.push('/pedidos');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      setLoading(false);
    }
   }
  };

  return (
    <div className={`w-full h-lvh flex flex-col justify-center items-center`}>
      <Image
        src="/fundo.png"
        alt="fundo"
        style={{ objectFit: 'fill' }}
        className="absolute inset-0 -z-50"
        fill
        priority={true}
      />
      <Card className="flex flex-col justify-center items-center sm:min-w-[390px] min-w-[350px] max-w-[480px] pt-5">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center items-center">
            <Image src="/logo.png" width={200} height={200} alt="logo" className="rounded-sm mb-5" />
            <p className="text-center text-zinc-800 text-xl font-medium">Bem-vindo(a) a Fish Find</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-zinc-800 ">
              <Label htmlFor="username" className="text-sm">
                Email*
              </Label>
              <Input
                name="email"
                type="text"
                placeholder="Digite seu email"
                onChange={handleChange}
                required
                className="h-9 rounded-sm text-xs mt-2"
                autoComplete="username"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div className="mb-4 text-zinc-800 text-xs relative">
              <Label htmlFor="password" className="text-sm">
                Senha*
              </Label>
              <Input
                name="password"
                type={visualizaSenha ? "password" : "tex"}
                placeholder="Digite sua senha"
                onChange={handleChange}
                required
                className="h-9 rounded-sm mt-2"
                style={{ fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => setVisualizaSenha(!visualizaSenha)}
                className="absolute right-2 top-9"
              >
                {visualizaSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="flex items-center space-x-2 mb-5">
              <Link
                href={'/auth/forgot-password'}
                className="text-xs  font-medium  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-[#095163] hover:underline cursor-pointer"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="flex h-9">
              <Button type="submit" className="w-full h-full rounded-sm text-xs bg-[#0a4273]" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-xs"></span>
                  : 'Entrar'}
              </Button>
            </div>
          </form>
          <div className="mt-5 flex justify-center text-zinc-800">
            <Label className="text-xs">
              Não tem uma conta?{' '}
              <Link
                href="/auth/cadastre"
                className="text-zinc-500 text-xs font-bold underline hover:text-[#0a4273]"
              >
                Cadastre-se
              </Link>
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}