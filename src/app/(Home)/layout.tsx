import { Navigation } from "./_components/navi";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen">{children}</div>
    </>
  );
}
