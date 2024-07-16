export async function fetchAPI<T = unknown>(
  url: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
      init,
    )

    const data = (await response.json()) as T

    return {
      data,
      status: response.status,
      ok: response.ok,
      headers: response.headers,
    }
  } catch (error) {
    console.error(error)

    return { data: null, status: 500, ok: false, headers: {}, error }
  }
}
