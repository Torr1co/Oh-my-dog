import React from "react";
import NavLink from "./NavLink";

export type NavItem = {
  label: string;
  href: string;
  roles?: Array<string | null>;
  children?: NavConfig;
};
export type NavConfig = Record<string, NavItem>;

export const navConfig = {
  home: { label: "Inicio", href: "/" },
  services: {
    label: "Servicios",
    href: "/services",
    roles: ["Client", null],
  },
  admin: {
    label: "Administracion",
    href: "/vet",
    roles: ["VET"],
    children: {
      services: { label: "Servicios", href: "/services" },
      clients: { label: "Clientes", href: "/clients" },
    },
  },
  dogAssistance: {
    label: "Asistencia de perros",
    href: "/dog-assistance",
    children: {
      adoptions: {
        label: "Adopciones",
        href: "/adoptions",
      },
      crossBreeds: { label: "Cruza", href: "/cross-breeds", roles: ["Client"] },
      donationCampaigns: {
        label: "Campañas de donacion",
        href: "/donation-campaigns",
      },
      lostDogs: {
        label: "Busqueda de perros",
        href: "/lost-dogs",
      },
    },
  },
  signin: { label: "Iniciar sesion", href: "/signin" },
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
