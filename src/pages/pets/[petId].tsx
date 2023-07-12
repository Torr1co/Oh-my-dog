import React, { useState } from "react";
import Title from "~/components/_common/Typo/Title";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import Box from "~/components/_common/Box";
import { type PetRelated, PetUpdateSchema } from "~/schemas/petSchema";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "~/components/_common/Form";
import { toast } from "react-hot-toast";
import PetInfo from "~/components/Vet/Clients/PetInfo";
import PetForm from "~/components/Vet/Clients/ClientRegister/PetForm";
import Button from "~/components/_common/Button";
import { petsRouter } from "~/server/api/routers/petsRouter";
import { prisma } from "~/server/db";
import ConfirmTooltip from "~/components/_common/ConfirmTooltip";
import { useRouter } from "next/router";
import { isVet } from "~/utils/schemas/usersUtils";
import BookingInfoList from "~/components/bookings/BookingInfo/BookingInfoList";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (typeof ctx.params?.petId !== "string" || !session) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  try {
    const trpc = petsRouter.createCaller({ session, prisma });
    const pet = await trpc.get(ctx.params.petId);
    return {
      props: {
        session,
        pet: JSON.stringify(pet),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

const PetPage = (props: { pet: string }) => {
  const { owner, ...pet } = JSON.parse(props.pet) as PetRelated;
  const { img, id, ...petData } = pet;
  const { data: session } = useSession();
  const router = useRouter();
  const [disableVisible, setDisableVisible] = useState(false);
  const methods = useForm<PetUpdateSchema>({
    resolver: zodResolver(PetUpdateSchema),
    defaultValues: {
      petId: id,
      dog: {
        ...petData,
        birth: new Date(petData.birth),
        img: img ?? undefined,
      },
    },
  });
  const { mutate: updatePet, isLoading: isUpdating } =
    api.pets.update.useMutation();
  const { mutate: disablePet, isLoading: isDisabling } =
    api.pets.disable.useMutation();
  console.log(pet.bookings);
  if (!session) return <></>;
  return (
    <div>
      <Form
        methods={methods}
        className="flex flex-col gap-12"
        onSubmit={(data) => {
          updatePet(data, {
            onSuccess: () => {
              toast.success("Se actualizo correctamente");
            },
            onError: () => {
              toast.error("Ya tiene un perro con ese nombre!");
            },
          });
        }}
      >
        <section>
          <header className="mb-14 flex items-center justify-between">
            <Title>
              Datos del <span className="capitalize">Perro</span>
            </Title>
          </header>
          <Box className=" bg-white">
            {isVet(session.user) ? (
              <div>
                <PetForm />
                <div className="mt-6 flex gap-4">
                  <Button type="submit" loading={isUpdating}>
                    Actualizar
                  </Button>
                  <div>
                    <ConfirmTooltip
                      open={disableVisible}
                      onReject={() => setDisableVisible(false)}
                      onConfirm={() => {
                        disablePet(
                          {
                            petId: id,
                          },
                          {
                            onSuccess: () => {
                              toast.success(
                                "Se deshabilito el perro correctamente"
                              );
                              void router.push("/admin/clients");
                            },
                            onError: () => {
                              toast.error("Ha sucedido un error");
                            },
                          }
                        );
                      }}
                    >
                      <Button
                        kind={Button.KINDS.danger}
                        onClick={() => setDisableVisible(true)}
                        loading={isDisabling}
                      >
                        Deshabilitar
                      </Button>
                    </ConfirmTooltip>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <PetInfo pet={pet} />
              </div>
            )}
          </Box>
        </section>
      </Form>
      <section>
        <header className="my-14 flex items-center justify-between">
          <Title>Historial medico</Title>
        </header>
        <BookingInfoList bookings={pet.bookings} />
      </section>
    </div>
  );
};

export default PetPage;
