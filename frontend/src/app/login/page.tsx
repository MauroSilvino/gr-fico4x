'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { fetchAPI } from '@/utils/fetchAPI'

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Campo Obrigatório')
    .email('Este campo deve ser um email'),
  password: z.string().min(1, 'Campo Obrigatório'),
})
type LoginType = z.infer<typeof LoginSchema>

export default function Login() {
  const router = useRouter()
  const methods = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { handleSubmit, formState, setError, register } = methods

  async function handleLogin(formsData: LoginType) {
    const loginResponse = await fetchAPI<{ message?: string }>('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formsData.email,
        password: formsData.password,
      }),
      credentials: 'include',
    })
    const { data } = loginResponse

    if (data?.message && data?.message === 'Invalid Credentials') {
      setError('email', { message: 'Email ou senha inválidos' })
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="flex h-screen w-screen items-center">
      <FormProvider {...methods}>
        <form
          className="mx-auto w-full max-w-md rounded-md border border-neutral-300 bg-background-light px-3 py-4 shadow-md md:px-5 md:py-6 dark:border-neutral-800 dark:bg-background-dark"
          onSubmit={handleSubmit(handleLogin)}
        >
          <img
            className="mx-auto mb-3 h-24 w-auto"
            src="/logo.svg"
            alt="Empresa Logo"
          />

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

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="loading w-full rounded-md bg-primary px-4 py-2 text-neutral-50 hover:bg-secondary"
          >
            Entrar
          </button>

          <a
            className="mt-4 block text-center text-xs text-neutral-500 hover:underline dark:text-neutral-300"
            href="/register"
          >
            Ainda não possui uma conta ?
          </a>
        </form>
      </FormProvider>
    </main>
  )
}
