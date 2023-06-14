import React from "react";
import { type Pet } from "@prisma/client";
import Title from "~/components/_common/Typo/Title";
import Link from "next/link";
import Text from "~/components/_common/Typo/Text";
import Image from "next/image";
import { getDogIcon } from "~/utils/styleUtils";

export function PetItem({ pet }: { pet: Pet }) {
  const PetIcon = getDogIcon(pet.id);
  return (
    <div className="items group flex gap-8">
      {pet.img ? (
        <div className="relative h-[76px] w-full max-w-[76px]">
          <Image
            src={pet.img}
            alt="pet photo"
            fill={true}
            className="rounded-full object-cover"
          />
        </div>
      ) : (
        <div>
          <PetIcon width="76" height="76" />
        </div>
      )}
      <div>
        <Title
          as="h4"
          size="font-semibold"
          className=" capitalize transition-colors duration-200 group-hover:text-primary"
        >
          {pet.name}
        </Title>
        <Text className="text-gray-500 transition-colors duration-200 truncate-2 group-hover:text-primary">
          {pet.observations}
        </Text>
      </div>
    </div>
  );
}

export default function PetList({ pets }: { pets: Pet[] }) {
  return (
    <ul className="grid grid-cols-3 gap-8">
      {pets.length > 0 ? (
        pets.map((pet) => (
          <li key={pet.id} className="">
            <Link href={"/pets/" + pet.id}>
              <PetItem pet={pet} />
            </Link>
          </li>
        ))
      ) : (
        <li className="col-span-3">
          <p className="text-center">No se encontraron perros</p>
        </li>
      )}
    </ul>
  );
}
