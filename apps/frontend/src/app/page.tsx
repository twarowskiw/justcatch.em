import { TrainerRegistrationForm } from '@/src/features/trainerRegistration/TrainerRegistrationForm'
import { getServerTime } from '@/src/lib/api'
import { PageLayout } from '@/src/features/home/components/PageLayout'

export default async function Page() {
  const time = await getServerTime()
  const date = new Date(time.utc)

  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
    .format(date)
    .replaceAll('/', '.')

  return (
    <PageLayout formattedDate={formatted}>
      <TrainerRegistrationForm />
    </PageLayout>
  )
}
