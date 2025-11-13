import { NavBar } from "@/components/layout/nav-bar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
