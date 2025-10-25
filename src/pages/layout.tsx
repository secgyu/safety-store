import { Geist, Geist_Mono } from "@/lib/next-fonts";
import { Analytics } from "@/lib/next-analytics";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans antialiased">
      {children}
      <Toaster />
      <Analytics />
    </div>
  );
}
