import React from "react";
import { navigate } from "../../routes/navigation.js";
import { useCountry } from "../../hooks/useCountry.js";
import { BrandLogo } from "./BrandLogo.tsx";

export function PublicFooter() {
  const { activeCountry, activeSlug } = useCountry();
  return (
    <footer className="relative bg-[#05020A] text-gray-300 py-16 px-[5vw] border-t border-white/10 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            {/* Logo Mark */}
            <button
              type="button"
              onClick={() =>
                navigate(activeSlug === "latam" ? "/" : `/${activeSlug}`)
              }
              aria-label="Ir al inicio"
              className="brand group flex items-center gap-3 bg-transparent border-0 p-0 cursor-pointer shrink-0"
            >
              <BrandLogo slug={activeSlug} isHeader={false} />
            </button>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Conectamos y potenciamos iniciativas que transforman Latinoamérica.
          </p>
          <div className="flex gap-4 mt-2">
            {/* Social Icons (Placeholders) */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c2.72 0 3.05.01 4.12.05 1.05.05 1.77.22 2.4.46.64.25 1.18.59 1.7 1.12.53.52.87 1.06 1.12 1.7.24.63.4 1.35.46 2.4.04 1.07.05 1.4.05 4.12s-.01 3.05-.05 4.12c-.05 1.05-.22 1.77-.46 2.4-.25.64-.59 1.18-1.12 1.7-.52.53-1.06.87-1.7 1.12-.63.24-1.35.4-2.4.46-1.07.04-1.4.05-4.12.05s-3.05-.01-4.12-.05c-1.05-.05-1.77-.22-2.4-.46-.64-.25-1.18-.59-1.7-1.12-.53-.52-.87-1.06-1.12-1.7-.24-.63-.4-1.35-.46-2.4-.04-1.07-.05-1.4-.05-4.12s.01-3.05.05-4.12c.05-1.05.22-1.77.46-2.4.25-.64.59-1.18 1.12-1.7.52-.53 1.06-.87 1.7-1.12.63-.24 1.35-.4 2.4-.46C8.95 2.01 9.28 2 12 2zm0 1.8c-2.68 0-3.01.01-4.07.05-.97.04-1.5.2-1.85.34-.46.18-.79.39-1.12.72-.33.33-.54.66-.72 1.12-.14.35-.3.88-.34 1.85-.04 1.06-.05 1.39-.05 4.07s.01 3.01.05 4.07c.04.97.2 1.5.34 1.85.18.46.39.79.72 1.12.33.33.66.54 1.12.72.35.14.88.3 1.85.34 1.06.04 1.39.05 4.07.05s3.01-.01 4.07-.05c.97-.04 1.5-.2 1.85-.34.46-.18.79-.39 1.12-.72.33-.33.54-.66.72-1.12.14-.35.3-.88.34-1.85.04-1.06.05-1.39.05-4.07s-.01-3.01-.05-4.07c-.04-.97-.2-1.5-.34-1.85-.18-.46-.39-.79-.72-1.12-.33-.33-.66-.54-1.12-.72-.35-.14-.88-.3-1.85-.34-1.06-.04-1.39-.05-4.07-.05zM12 6.86A5.14 5.14 0 1017.14 12 5.14 5.14 0 0012 6.86zm0 8.48A3.34 3.34 0 1115.34 12 3.34 3.34 0 0112 15.34zM18.4 6.8a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.46c0-1.3-.02-2.98-1.81-2.98-1.81 0-2.09 1.42-2.09 2.88v5.56h-3v-10h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.59z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Columns */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Navega
            </h4>
            <button
              onClick={() =>
                navigate(
                  `${activeSlug === "latam" ? "/" : `/${activeSlug}`}#somos`,
                )
              }
              className="text-left hover:text-white transition-colors w-fit"
            >
              Quiénes somos
            </button>
            <button
              onClick={() =>
                navigate(
                  `${activeSlug === "latam" ? "/" : `/${activeSlug}`}#impacto`,
                )
              }
              className="text-left hover:text-white transition-colors w-fit"
            >
              Nuestro impacto
            </button>
            <button
              onClick={() =>
                navigate(
                  `${activeSlug === "latam" ? "/" : `/${activeSlug}`}#equipo`,
                )
              }
              className="text-left hover:text-white transition-colors w-fit"
            >
              Equipo
            </button>
            <button
              onClick={() => navigate("/noticias")}
              className="text-left hover:text-white transition-colors w-fit"
            >
              Noticias
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Recursos
            </h4>
            <button
              onClick={() => navigate("/login")}
              className="text-left hover:text-white transition-colors w-fit"
            >
              Tu aula
            </button>

            <a
              href="https://colombia-comparte-dashboard.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left hover:text-white transition-colors w-fit"
            >
              Simulador
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Contáctanos
            </h4>
            <p className="text-sm">+ (57) 317 220 330</p>
            <a
              href="mailto:comunicaciones@colombiacomparte.com"
              className="text-sm hover:text-white transition-colors"
            >
              comunicaciones@colombiacomparte.com
            </a>
            <p className="text-sm">Bogotá, Colombia</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>
          © Copyright 2024 Latinoamérica Comparte. Todos los derechos
          reservados.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Términos y condiciones
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
