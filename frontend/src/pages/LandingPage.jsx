import HeroQuote from '../components/HeroQuote'

function LandingPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeroQuote />
      <section id="login" className="sr-only" aria-label="Login" />
      <section id="signup" className="sr-only" aria-label="Sign Up" />
    </main>
  )
}

export default LandingPage
