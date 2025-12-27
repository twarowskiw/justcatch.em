export type TimeResponse = {
  utc: string
  source: string
}

export type SearchSuggestion = {
  id: number
  name: string
  score: number
}

export type PokemonDetails = {
  id: number
  name: string
  baseExperience: number
  imageUrl: string | null
  types: string[]
}

export type TrainerRequest = {
  name: string
  age: number
  pokemonId: number
  pokemonName: string
}

export type ApiUrlOptions = {
  baseUrl?: string
}

export function apiUrl(path: string, options?: ApiUrlOptions): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const p = path.startsWith('/') ? path : `/${path}`

  // If the server component passes an origin/baseUrl, build an absolute URL.
  if (options?.baseUrl) {
    const base = options.baseUrl.endsWith('/') ? options.baseUrl.slice(0, -1) : options.baseUrl
    return `${base}${p}`
  }

  if (typeof window !== 'undefined') return p

  const internal = process.env.INTERNAL_BACKEND_URL ?? 'http://backend:8080'

  const base = internal.endsWith('/') ? internal.slice(0, -1) : internal
  return `${base}${p}`
}

export async function getServerTime(options?: ApiUrlOptions): Promise<TimeResponse> {
  const res = await fetch(apiUrl('/api/time', options), {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to load time')
  return res.json()
}

export async function searchPokemon(q: string): Promise<SearchSuggestion[]> {
  const qs = new URLSearchParams({ q })
  const res = await fetch(apiUrl(`/api/search?${qs.toString()}`), {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function getPokemonDetails(id: number): Promise<PokemonDetails> {
  const qs = new URLSearchParams({ id: String(id) })
  const res = await fetch(apiUrl(`/api/pokemon?${qs.toString()}`), {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Pokemon fetch failed')
  return res.json()
}

export async function submitTrainer(payload: TrainerRequest): Promise<void> {
  const res = await fetch(apiUrl('/api/trainer'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) throw new Error('Submit failed')
}
