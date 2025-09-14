import { ProfileProvider } from "@/components/ProfileContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900">
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
