import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl gap-6 p-4">
            <Link href="/">
              Home
            </Link>

            <Link href="/chat">
              Chat
            </Link>

            <Link href="/stream">
              Stream
            </Link>

            <Link href="/review">
              Review
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}