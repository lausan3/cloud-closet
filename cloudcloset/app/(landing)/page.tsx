// app/(landing)/page.tsx
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-zinc-200 ">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16 translate-y-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_3fr] items-center">
          {/* Left: Brand / Auth */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide">
                  CLOUD CLOSET
                </h1>
                <p className="text-xs text-zinc-400 -mt-0.5">
                  Dress smarter not harder
                </p>
              </div>
            </div>

            <div className="pt-3 translate-x-12">
              <SignedOut>
                <div className="flex gap-3">
                  <SignInButton mode="modal">
                    <RainbowButton>Login</RainbowButton>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <RainbowButton>Sign Up</RainbowButton>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-sm text-white hover:bg-white/15"
                >
                  Go to dashboard
                </Link>
              </SignedIn>
            </div>
          </section>

          {/* Right: YouTube embed with glassy frame */}
          <section>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)] blur-xl" />

              <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-3 md:p-4 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_40px_80px_-40px_rgba(0,0,0,0.6)]">
                <div className="rounded-[22px] ring-1 ring-white/10 overflow-hidden bg-black/40 aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/jfKfPfyJRdk?si=KNbpopQ9XU-arsjF&controls=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Cloud Closet
        </footer>
      </div>
    </main>
  );
}