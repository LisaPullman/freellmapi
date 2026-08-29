import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'

// Catch-all route: before this, an unknown URL rendered the navbar over a
// silent empty page. Same brand-halo idiom as EmptyState so a 404 feels
// like a sign-post from the brand, not a generic dead end.
export default function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center">
        <div
          aria-hidden="true"
          className="mx-auto flex size-10 items-center justify-center rounded-full bg-[var(--brand-muted)] text-brand"
        >
          <Compass className="size-5" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">{t('notFound.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('notFound.description')}</p>
        <div className="mt-5">
          <Link to="/">
            <Button size="sm">{t('errors.goHome')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
