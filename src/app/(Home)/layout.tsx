import { UserAuthButton } from "@/components/auth/user-auth-button";
import ThemeToggle from "@/components/app/ThemeToggle";
import { Navigation } from "@/components/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-6">张舟辰</h1>
            <Navigation />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserAuthButton />
          </div>
        </div>
      </header>
      <main className="min-h-screen">{children}</main>
    </>
  );
}
