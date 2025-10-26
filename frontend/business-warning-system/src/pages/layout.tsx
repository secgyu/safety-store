import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/lib/next-analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans antialiased">
      {children}
      <Toaster />
      <Analytics />
    </div>
  );
}
