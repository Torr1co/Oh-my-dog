import { type Dog } from ".prisma/client";
import { type AdoptPublication } from "@prisma/client";
import React from "react";
import { useModal } from "~/context/ModalContex";
import Box from "~/lib/Box";
import Button from "~/lib/Button";
import { PetIcon } from "~/lib/icons";
import Text from "~/lib/Typo/Text";
import Title from "~/lib/Typo/Title";
import Adopt from "./Adopt";
import AdoptPublicationUpdate from "./AdoptPublicationUpdate";

export default function AdoptList({
  adoptions,
  mine = false,
}: {
  adoptions: Array<
    AdoptPublication & {
      dog: Dog;
    }
  >;
  mine?: boolean;
}) {
  const { handleModal } = useModal();
  return adoptions.length === 0 ? (
    <div>No se encontraron publicaciones de adopcion</div>
  ) : (
    <ul className="grid grid-cols-2 gap-12">
      {adoptions.map((adoption) => {
        return (
          <li key={adoption.id} className="h-full">
            <Box className="flex h-full flex-col gap-8 bg-white">
              <div className="items group flex justify-between">
                <div>
                  <PetIcon width="100" height="100" />
                </div>
                <div>
                  <Text>{adoption.email}</Text>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {adoption.dog.name !== "" && (
                  <Title
                    as="h2"
                    className=" transition-colors duration-200 truncate group-hover:text-primary"
                  >
                    {adoption.dog.name}
                  </Title>
                )}
                {adoption.info && (
                  <Text className="text-gray-500 transition-colors duration-200 truncate-3 group-hover:text-primary">
                    {adoption.info}
                  </Text>
                )}
                <Text className="text-gray-500 transition-colors duration-200 truncate-2 group-hover:text-primary">
                  {adoption.reason}
                </Text>
              </div>
              <div className="mt-auto">
                {mine ? (
                  <Button
                    kind={Button.KINDS.gray}
                    onClick={() =>
                      handleModal(
                        <AdoptPublicationUpdate adoption={adoption} />
                      )
                    }
                  >
                    Editar
                  </Button>
                ) : (
                  <Button
                    kind={Button.KINDS.gray}
                    onClick={() => handleModal(<Adopt adoption={adoption} />)}
                  >
                    Adoptar
                  </Button>
                )}
              </div>
            </Box>
          </li>
        );
      })}
    </ul>
  );
}
