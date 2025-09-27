import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import Sidebar from "../sidebar";
import Chatbox from "../chatbox";

export default function Home() {
  return (
    <>
        <main >
          <div className={'absolute right-10 items-center p-4 gap-4 h-15 top-12'}>
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer ">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
          </div>

        {/* content */}
        <div className="flex">
          <Sidebar />
          <div className="p-[3vw] flex flex-col h-[1vw]">
            {/* Logo */}
            <div id="LOGO">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide">
                    CLOUD CLOSET
                  </h1>
                  <p className="text-xs text-zinc-400 -mt-0.5">
                    Dress smarter not harder
                  </p>
                </div>
              </div>
            </div>

            {/* Chatbox below logo */}
            <Chatbox />
          </div>
        </div>

        
        
      </main>
    </>
  );
}
