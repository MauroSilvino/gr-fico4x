'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { fetchAPI } from '@/utils/fetchAPI'

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
  const router = useRouter()
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

    const registerResponse = await fetchAPI<{ message?: string }>('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formsData.name,
        email: formsData.email,
        password: formsData.password,
        repeatPassword: formsData.repeatPassword,
      }),
      credentials: 'include',
    })
    const { data } = registerResponse

    if (data?.message && data?.message === 'Passwords Do Not Match') {
      setError('repeatPassword', { message: 'As senhas não coincidem' })
      return
    }

    if (data?.message && data?.message === 'Email Already Exists') {
      setError('email', { message: 'Email já existente' })
      return
    }

    router.push('/login')
  }

  return (
    <main className="flex h-screen w-screen items-center">
      <FormProvider {...methods}>
        <form
          className="mx-auto w-full max-w-md rounded-md border border-neutral-300 bg-background-light px-3 py-4 shadow-md md:px-5 md:py-6 dark:border-gray-700 dark:bg-background-dark"
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
              className="mt-1 h-10 w-full rounded-md bg-body-light px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary dark:bg-body-dark"
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
              className="mt-1 h-10 w-full rounded-md bg-body-light px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary dark:bg-body-dark"
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
              className="mt-1 h-10 w-full rounded-md bg-body-light px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary dark:bg-body-dark"
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
              type="password"
              placeholder="Repita sua Senha"
              className="mt-1 h-10 w-full rounded-md bg-body-light px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary dark:bg-body-dark"
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
            disabled={formState.isSubmitting}
            className="loading w-full rounded-md bg-primary px-4 py-2 text-neutral-50 hover:bg-secondary"
          >
            Cadastrar
          </button>

          <a
            className="mt-4 block text-center text-xs text-neutral-500 hover:underline dark:text-neutral-300"
            href="/login"
          >
            Já está cadastrado ?
          </a>
        </form>
      </FormProvider>
    </main>
  )
}
