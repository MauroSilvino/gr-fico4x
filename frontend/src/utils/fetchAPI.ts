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
    return { status: response.status, data }
  } catch (error) {
    return { error, data: null }
  }
}
