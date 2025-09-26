
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Sidebar from "./sidebar";

export default function Home() {
  return (
    <>
        <main >
          <div className={'absolute right-3 items-center p-4 gap-4 h-15'}>
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
        <Sidebar/>
      </main>
    </>
  );
}
