import React from "react";
import { UserRoles } from "@prisma/client";
import { type GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import ClientHome from "~/components/Home/ClientHome";
import UnregisteredHome from "~/components/Home/UnregisteredHome";
import VetHome from "~/components/Home/VetHome";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <UnregisteredHome />;
  }

  if (session.user.role === UserRoles.VET) {
    return <VetHome />;
  }

  return <ClientHome />;
};

export default Home;
