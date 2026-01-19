import Script from "next/script";
// import { InkeepBubble } from "@/components/inkeep-bubble";
import InkeepSearchBox from "@/components/inkeep-search";

import "./global.css";
import Scroller from "@/components/scroller";
// import { Analytics } from "@vercel/analytics/react";
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
        <Script id="wwads-inject" strategy="afterInteractive">
          {`
            (function () {
              function injectAdsIntoLayout() {
                const tocRoot = document.getElementById("nd-toc");
                if (!tocRoot) return;

                const firstChild = tocRoot.firstElementChild;
                if (!firstChild) return;

                if (firstChild.querySelector(".wwads-cn.wwads-vertical")) return;

                const verticalAd = document.createElement("div");
                verticalAd.className = "wwads-cn wwads-vertical";
                verticalAd.setAttribute(
                  "style",
                  "width: 100%; margin: 1rem 0 !important; flex-shrink: 0;"
                );
                verticalAd.setAttribute("data-id", "354");
                firstChild.insertBefore(verticalAd, firstChild.firstChild);
              }

              function runWhenDomReady(fn) {
                if (document.readyState === "loading") {
                  document.addEventListener("DOMContentLoaded", fn, { once: true });
                } else {
                  fn();
                }
              }

              runWhenDomReady(() => {
                injectAdsIntoLayout();

                const observer = new MutationObserver(() => {
                  injectAdsIntoLayout();
                });

                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                });
              });
            })();
          `}
        </Script>
      </head>

      <body className="flex flex-col min-h-screen">
        <Banner id="rainyun">
          <a
            className="no-underline"
            href="https://www.rainyun.com/mm_?s=zhcndoc"
            target="_blank"
          >
            💎 雨云 RainYun - 企业级云计算服务提供商
          </a>
        </Banner>
        {/* <InkeepBubble /> */}
        {/* <Analytics /> */}
        <RootProvider
          search={{
            enabled: true,
            // SearchDialog: InkeepSearchBox,
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
