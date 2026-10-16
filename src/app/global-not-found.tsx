import type { Metadata } from "next";
import Link from "next/link";
import { plexMono, sora } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "404 · Mayara Lucy",
  description: "Página não encontrada · Page not found",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${plexMono.variable}`}>
      <body data-theme="dark" className="grid min-h-svh place-items-center">
        <main className="container-x py-24">
          <p className="kicker">404</p>
          <h1 className="section-title mt-6">
            Esta camada não existe. <strong>This layer doesn&apos;t exist.</strong>
          </h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/">
              Voltar ao início
            </Link>
            <Link className="btn btn-ghost" href="/en">
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
