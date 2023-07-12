import React, { useState } from "react";
import { useModal } from "~/context/ModalContex";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Title from "~/components/_common/Typo/Title";
import Button from "~/components/_common/Button";
import DonationCreationModal from "~/components/DonationCampaigns/DonationCampaignCreationModal";
import DonationCampaignList from "~/components/DonationCampaigns/DonationCampaignList";
import { isVet } from "~/utils/schemas/usersUtils";
import Toggle from "~/components/_common/Form/Toggle";
import { DonationCampaignStatus } from "@prisma/client";

const DonationCampaigns = () => {
  const { handleModal } = useModal();

  const { data: session } = useSession();
  const [finished, setFinished] = useState(false);
  const { data: donationCampaigns = [], isLoading } =
    api.donationCampaigns.getAll.useQuery({
      status: finished
        ? DonationCampaignStatus.FINISHED
        : DonationCampaignStatus.ACTIVE,
    });

  return (
    <div>
      <header className="my-14 flex items-center justify-between">
        {/* {Mejora este mensaje} */}
        <Title>Campañas de donacion</Title>
        <div className="flex gap-4">
          <Toggle
            label="Ver campañas finalizadas"
            checked={finished}
            onChange={() => setFinished((prev) => !prev)}
          />
          {isVet(session?.user) && (
            <Button
              kind={Button.KINDS.gray}
              className="transition-colors duration-300"
              onClick={() => handleModal(<DonationCreationModal />)}
            >
              Crear publicacion
            </Button>
          )}
        </div>
      </header>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <DonationCampaignList donationCampaigns={donationCampaigns} />
      )}
    </div>
  );
};

export default DonationCampaigns;
