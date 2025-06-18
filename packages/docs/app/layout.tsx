import { InkeepBubble } from "@/components/inkeep-bubble";
import InkeepSearchBox from "@/components/inkeep-search";

import "./global.css";
import Scroller from "@/components/scroller";
import { Analytics } from "@vercel/analytics/react";
import { Banner } from "fumadocs-ui/components/banner";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import { type ReactNode, Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Preload critical images to prevent FOUC */}
        <link rel="preload" as="image" href="/logo/logo-glow.png" />
        <link rel="preload" as="image" href="/logo/logo.png" />
        <link
          rel="preload"
          as="image"
          href="https://raw.githubusercontent.com/colinhacks/zod/3782fe29920c311984004c350b9fefaf0ae4c54a/logo.svg"
        />

        <script async src="https://www.zhcndoc.com/js/common.js"></script>
      </head>
      <body className="flex flex-col min-h-screen">
        <Banner id="zod4">
          💎 Zod 4 现已稳定发布！<span>&nbsp;</span>
          <a className="underline" href="/v4">
            阅读公告。
          </a>
        </Banner>
        <InkeepBubble />
        <Analytics />
        <RootProvider
          search={{
            enabled: true,
            SearchDialog: InkeepSearchBox,
          }}
          theme={{}}
        >
          {children}
        </RootProvider>
        <Suspense fallback={null}>
          <Scroller />
        </Suspense>
      </body>
    </html>
  );
}
