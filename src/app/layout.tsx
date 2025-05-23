import { Montserrat } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ReduxProvider from '@/lib/redux/provider';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title:
    "Honeybee Harry's",
  description: "Admin Dashboard",
};

const montserrat = Montserrat({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${montserrat.className} dark:bg-gray-900`}
        data-new-gr-c-s-check-loaded="14.1235.0"
        data-gr-ext-installed=""
        cz-shortcut-listen="true"
        style={{
          background:
            "radial-gradient(ellipse at bottom center, #FFF4D2 0%, #F8F8F8 60%)",
        }}>
        <ReduxProvider>
          <ThemeProvider>
            <SidebarProvider> <Toaster />{children}</SidebarProvider>
          </ThemeProvider>

        </ReduxProvider>
      </body>
    </html>
  );
}
