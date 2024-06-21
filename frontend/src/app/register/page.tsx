'use client'

import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(1, 'Campo Obrigatório'),
  email: z
    .string()
    .min(1, 'Campo Obrigatório')
    .email('Este campo deve ser um email'),
  password: z.string().min(1, 'Campo Obrigatório'),
  repeatPassword: z.string().min(1, 'Campo Obrigatório'),
})
type RegisterType = z.infer<typeof RegisterSchema>

export default function Register() {
  const methods = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  })
  const { handleSubmit, formState, setError, register } = methods

  async function handleRegister(formsData: RegisterType) {
    if (formsData.password !== formsData.repeatPassword) {
      setError('repeatPassword', { message: 'As senhas não coincidem' })
      return
    }

    // TODO: FetchAPI
  }

  return (
    <main className="flex h-screen w-screen items-center">
      <FormProvider {...methods}>
        <form
          className="mx-auto w-full max-w-md rounded-md border border-neutral-300 bg-background px-3 py-4 shadow-md md:px-5 md:py-6"
          onSubmit={handleSubmit(handleRegister)}
        >
          <img
            className="mx-auto mb-3 h-24 w-auto"
            src="/logo.svg"
            alt="Empresa Logo"
          />

          <div className="mb-3 flex flex-col">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu Nome"
              className="mt-1 h-10 w-full rounded-md bg-body px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary"
              {...register('name')}
            />
            {formState.errors.name && (
              <span className="mt-1 block pl-2 text-sm text-red-500">
                {formState.errors.name?.message?.toString()}
              </span>
            )}
          </div>

          <div className="mb-3 flex flex-col">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Digite seu Email"
              className="mt-1 h-10 w-full rounded-md bg-body px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary"
              {...register('email')}
            />
            {formState.errors.email && (
              <span className="mt-1 block pl-2 text-sm text-red-500">
                {formState.errors.email?.message?.toString()}
              </span>
            )}
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua Senha"
              className="mt-1 h-10 w-full rounded-md bg-body px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary"
              {...register('password')}
            />
            {formState.errors.password && (
              <span className="mt-1 block pl-2 text-sm text-red-500">
                {formState.errors.password?.message?.toString()}
              </span>
            )}
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="repeatPassword" className="text-sm font-medium">
              Repetir Senha
            </label>
            <input
              id="repeatPassword"
              type="repeatPassword"
              placeholder="Repita sua Senha"
              className="mt-1 h-10 w-full rounded-md bg-body px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary"
              {...register('repeatPassword')}
            />
            {formState.errors.repeatPassword && (
              <span className="mt-1 block pl-2 text-sm text-red-500">
                {formState.errors.repeatPassword?.message?.toString()}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-neutral-50 hover:bg-secondary"
          >
            Entrar
          </button>

          <a
            className="mt-4 block text-center text-xs text-neutral-500 hover:underline"
            href="/login"
          >
            Já está cadastrado ?
          </a>
        </form>
      </FormProvider>
    </main>
  )
}
