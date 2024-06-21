export default function Register () {
    return (
        <div className="m-5 my-10">
            <div className="flex justify-center items-center">
                <h3 className="font-semibold text-2xl">Entrar</h3>
            </div>
            <form className="flex flex-col my-6 gap-3">
                <input className="p-3 rounded-md border" type="email" placeholder="Número de telefone ou e-mail"/>
                <input className="p-3 rounded-md border" type="password" placeholder="Senha"/>
                <button className="bg-green-600 text-white p-3 rounded-md">Entrar</button>
            </form>
            <div className="flex flex-col items-center gap-4">
                <p className="text-orange-500 text-xs cursor-pointer">Esqueceu a senha?</p>
                <p className="text-xs">Ainda não possui uma conta? <span className="text-orange-500 cursor-pointer">Inscreva-se</span> </p>
            </div>
        </div>
    )
}
