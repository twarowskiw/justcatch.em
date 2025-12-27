import { http, HttpResponse } from 'msw'

let searchCallCount = 0

export function resetSearchCallCount() {
  searchCallCount = 0
}

export function getSearchCallCount() {
  return searchCallCount
}

const backend = 'http://backend.test'

export const handlers = [
  http.get(`${backend}/api/search`, ({ request }) => {
    searchCallCount++
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''

    if (q.toLowerCase().startsWith('pi')) {
      return HttpResponse.json([
        { id: 25, name: 'pikachu', score: 99 },
        { id: 172, name: 'pichu', score: 90 }
      ])
    }

    return HttpResponse.json([])
  }),

  http.get(`${backend}/api/pokemon`, ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (id === '25') {
      return HttpResponse.json({
        id: 25,
        name: 'pikachu',
        baseExperience: 112,
        imageUrl: 'https://example.test/pikachu.png',
        types: ['electric']
      })
    }

    return new HttpResponse(null, { status: 404 })
  }),

  http.post(`${backend}/api/trainer`, async ({ request }) => {
    const body = (await request.json()) as {
      name?: string
      age?: number
      pokemonId?: number
      pokemonName?: string
    }

    if (!body?.name || !body?.age || !body?.pokemonId || !body?.pokemonName) {
      return new HttpResponse(null, { status: 400 })
    }

    return new HttpResponse(null, { status: 201 })
  })
]
