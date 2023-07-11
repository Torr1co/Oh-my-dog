import React from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import Form from "~/components/_common/Form";
import { useModal } from "~/context/ModalContex";
import DonationCampaignForm from "./DonationCampaignForm";
import { DonationCampaignUpdateSchema } from "~/schemas/donationSchema";
import { useForm } from "~/utils/schemaUtils";
import { type DonationCampaign } from "@prisma/client";

export default function DonationCampaignUpdateModal({
  donationCampaign: { createdAt, updatedAt, ...donationCampaign },
}: {
  donationCampaign: DonationCampaign;
}) {
  const { handleModal } = useModal();
  const utils = api.useContext();
  const { mutate: updatePublication, isLoading } =
    api.donationCampaigns.update.useMutation({
      onSuccess: async () => {
        await utils.donationCampaigns.getAll.invalidate();
        await utils.donationCampaigns.getById.invalidate();
      },
    });
  const methods = useForm<DonationCampaignUpdateSchema>({
    schema: DonationCampaignUpdateSchema,
    defaultValues: {
      ...donationCampaign,
      id: donationCampaign.id,
      img: donationCampaign.img ?? undefined,
      endDate: new Date(donationCampaign.endDate),
    },
  });

  return (
    <Form
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        updatePublication(data, {
          onSuccess: () => {
            toast.success("La campaña fue actualizada con exito");
            handleModal();
          },
          onError: (err) => toast.error(err.message),
        });
      }}
    >
      <header className="sticky top-10 z-30 -mx-4 flex items-center justify-between bg-white p-4 pb-4">
        <Title as="h4" className="text-gray-500">
          Editar <span className="text-primary">Campaña de Donacion</span>
        </Title>
        <div className="pl-auto">
          <Button type="submit" loading={isLoading} size="sm">
            Actualizar
          </Button>
        </div>
      </header>
      <DonationCampaignForm />
    </Form>
  );
}
