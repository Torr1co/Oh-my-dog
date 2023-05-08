import React from "react";
import NavLink from "./NavLink";

export type NavItem = {
  label: string;
  href: string;
  roles?: Array<string | null>;
  children?: NavConfig;
};
export type NavConfig = Record<string, NavItem>;

export const LINKS = {
  home: "/",
  services: "/services",
  clients: "/admin/clients",
  signin: "/auth/signin",
  dogAssistance: "/dog-assistance",
  adoptions: "/dog-assistance/adoptions",
  crossBreeds: "/dog-assistance/cross-breeds",
  donationCampaigns: "/dog-assistance/donation-campaigns",
  lostDogs: "/dog-assistance/lost-dogs",
} as const;

export const navConfig = {
  home: { label: "Inicio", href: LINKS.home },
  services: {
    label: "Servicios",
    href: LINKS.services,
    roles: ["Client", null],
  },
  admin: {
    label: "Administracion",
    href: "/admin",
    roles: ["VET"],
    children: {
      services: { label: "Servicios", href: LINKS.services },
      clients: { label: "Clientes", href: LINKS.clients },
    },
  },
  dogAssistance: {
    label: "Asistencia de perros",
    href: "/dog-assistance",
    children: {
      adoptions: {
        label: "Adopciones",
        href: LINKS.adoptions,
      },
      crossBreeds: {
        label: "Cruza",
        href: LINKS.crossBreeds,
        roles: ["Client"],
      },
      donationCampaigns: {
        label: "Campañas de donacion",
        href: LINKS.donationCampaigns,
      },
      lostDogs: {
        label: "Busqueda de perros",
        href: LINKS.lostDogs,
      },
    },
  },
  signin: { label: "Iniciar sesion", href: "/auth/signin" },
};

export default function Navbar() {
  return (
    <nav>
      <ul className="flex items-center gap-5 font-medium">
        <NavLink link={navConfig.home} />
        <NavLink link={navConfig.services} />
        <NavLink link={navConfig.admin} />
        <NavLink link={navConfig.dogAssistance} />
      </ul>
    </nav>
  );
}
