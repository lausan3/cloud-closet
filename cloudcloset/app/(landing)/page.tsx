// app/(landing)/page.tsx
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Cloud Closet
        </Link>

        <nav className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="h-9 rounded-full px-4 text-sm font-medium border">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="h-9 rounded-full px-4 text-sm font-medium bg-[#6c47ff] text-white">
                Get started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </nav>
      </header>

      {/* Hero */}
      <main className="px-6 py-16">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Your AI-powered digital wardrobe
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Upload clothes, get smart outfit ideas, and plan looks in seconds.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="h-11 rounded-full px-6 text-sm sm:text-base font-medium bg-[#6c47ff] text-white">
                  Create free account
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="h-11 rounded-full px-6 text-sm sm:text-base font-medium border">
                  I already have an account
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="h-11 inline-flex items-center justify-center rounded-full px-6 text-sm sm:text-base font-medium bg-[#6c47ff] text-white"
              >
                Go to dashboard
              </Link>
            </SignedIn>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required.
          </p>
        </section>

        {/* Features (optional) */}
        <section className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold">Smart outfits</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              AI suggests looks from items you already own.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold">Plan your week</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Build a calendar of fits for any occasion.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold">Easy uploads</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag & drop images—no complicated steps.
            </p>
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Cloud Closet
      </footer>
    </>
  );
}
