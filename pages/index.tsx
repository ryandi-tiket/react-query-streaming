import { useInfiniteQuery, useQuery } from 'react-query'
import { useMemo } from 'react'

export default function Home() {
  const initialQuery = useQuery(
    'initial',
    () => fetch('/api/initial').then((res) => res.json()),
    {
      onSuccess: () => {
        console.log('AYOOOOO', new Date().toLocateDateString())
      },
    }
  )

  const streamingQuery = useInfiniteQuery(
    [
      'streaming',
      {
        requestItems: initialQuery.data?.requestItems,
      },
    ],
    ({ pageParam: requestItems = initialQuery.data?.requestItems }) =>
      fetch('/api/streaming', { method: 'POST', body: requestItems }).then(
        (res) => res.json()
      ),
    {
      enabled: Boolean(
        initialQuery.status === 'success' &&
          initialQuery.data.requestItems?.length
      ),
      getNextPageParam: (lastStream, allStreams) => {
        if (
          lastStream.searchCompleted ||
          lastStream.requestItems?.length === 0
        ) {
          // no next stream
          return
        }

        return lastStream.requestItems
      },
      onSuccess: ({ pages: allStreams }) => {
        const lastStream = allStreams[allStreams.length - 1]
        console.log('🙌 stream success   ', new Date().toLocaleTimeString())
        const hasNext =
          !lastStream.searchCompleted && lastStream.requestItems?.length > 0

        if (hasNext) {
          console.log(
            '⌛ streaming next   ',
            new Date().toLocaleTimeString()
          )

          setTimeout(() => {
            console.log(
              '🏃 streaming next   ',
              new Date().toLocaleTimeString()
            )
            streamingQuery.fetchNextPage()
          }, 1000)
        } else {
          console.log('🏁 no more next stream', new Date().toLocaleTimeString())
        }
      },
      refetchOnWindowFocus: false,
    }
  )

  const streamingData = useMemo(() => {
    if (!streamingQuery.data?.pages) return []

    let data: any = []

    for (const stream of streamingQuery.data.pages) {
      data = [...data, ...stream.data]
    }

    return data
  }, [streamingQuery.data])

  if (initialQuery.status !== 'success' || streamingQuery.status !== 'success')
    return null

  return (
    <div>
      <h1>HALO</h1>
      <pre>{JSON.stringify(streamingData, null, 2)}</pre>
      <pre>{JSON.stringify(streamingQuery.data?.pages, null, 2)}</pre>
    </div>
  )
}
