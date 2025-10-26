import AddOrEditMagazineClient from '../../../components/admin/AddOrEditMagazineClient'

type PageProps = {
  params?: Promise<{ [key: string]: any }>
  searchParams?: Promise<any>
}

export default async function Page({ params, searchParams }: PageProps) {
  // Resolve possible promise-wrapped params/searchParams from Next's type
  const resolvedParams = params ? await params : undefined
  const resolvedSearch = searchParams ? await searchParams : undefined

  // Determine eventId from route params or search params and pass to client component
  let eventId: string | null | undefined = undefined

  if (resolvedParams && typeof resolvedParams === 'object' && 'eventId' in resolvedParams) {
    eventId = (resolvedParams as any).eventId
  } else if (resolvedSearch) {
    // resolvedSearch may be a plain object or URLSearchParams-like
    if (typeof (resolvedSearch as any).get === 'function') {
      eventId = (resolvedSearch as URLSearchParams).get('eventId') || undefined
    } else if (typeof resolvedSearch === 'object') {
      eventId = (resolvedSearch as any).eventId
    }
  }

  return <AddOrEditMagazineClient eventId={eventId ?? null} />
}
