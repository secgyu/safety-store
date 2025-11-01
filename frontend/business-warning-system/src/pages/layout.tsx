import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans antialiased">
      {children}
      <Toaster />
    </div>
  );
}
