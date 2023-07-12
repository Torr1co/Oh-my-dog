import React, { useState } from "react";
import Button from "../_common/Button";
import { type Service } from "@prisma/client";
import { useModal } from "~/context/ModalContex";
import ServiceUpdateModal from "./ServiceUpdateModal";
import { api } from "~/utils/api";
import ConfirmTooltip from "../_common/ConfirmTooltip";
import Dropdown from "../_common/Dropdown";
import Form from "../_common/Form";
import { ServiceOptions } from "~/schemas/serviceSchema";
import { useSession } from "next-auth/react";
import ServiceContactModal from "./ServiceContactModal";
import { isVet } from "~/utils/schemas/usersUtils";
import { toast } from "react-hot-toast";

export const ServicesFilters = () => {
  const { data: session } = useSession();

  return (
    <Dropdown
      label={<Button kind={Button.KINDS.gray}>Opciones</Button>}
      placement={isVet(session?.user) ? "bottom" : "bottomRight"}
    >
      <div className=" flex min-w-[320px] flex-col gap-4">
        {isVet(session?.user) && (
          <Form.Toggle label="Servicios habilitados" path="enabled" />
        )}
        <Form.Select
          label="Filtrar por tipo de servicio"
          kind="bg-white"
          path="serviceType"
          values={[
            {
              value: null,
              label: "Ver todos los tipos",
            },
            ...ServiceOptions,
          ]}
        />
        <Form.Input
          label="Filtrar por email de contacto"
          path="email"
          placeholder="Buscar por email de contacto"
        />
      </div>
    </Dropdown>
  );
};

const EnableService = ({ service }: { service: Service }) => {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);
  const { mutate: updateService, isLoading } = api.services.update.useMutation({
    onSuccess: async () => {
      await utils.services.getAll.invalidate();
    },
  });
  return (
    <ConfirmTooltip
      open={open}
      onReject={() => setOpen(false)}
      onConfirm={() => {
        updateService(
          {
            id: service.id,
            availability: !service.availability,
          },
          {
            onSuccess: () => {
              setOpen(false);
              toast.success(
                `Servicio ${
                  service.availability ? "deshabilitado" : "habilitado"
                } exitosamente`
              );
            },
          }
        );
      }}
    >
      <Button
        kind={Button.KINDS.gray}
        loading={isLoading}
        onClick={() => setOpen(true)}
      >
        {service.availability ? "Deshabilitar" : "Habilitar"}
      </Button>
    </ConfirmTooltip>
  );
};

export const ServiceActions = ({ service }: { service: Service }) => {
  const { data: session } = useSession();
  const { handleModal } = useModal();

  return isVet(session?.user) ? (
    <div className="flex gap-4">
      <Button
        kind={Button.KINDS.gray}
        onClick={() => {
          handleModal(<ServiceUpdateModal service={service} />);
        }}
      >
        Editar
      </Button>
      <EnableService service={service} />
    </div>
  ) : (
    <div className="flex gap-4">
      <Button
        kind={Button.KINDS.gray}
        onClick={() => {
          handleModal(<ServiceContactModal service={service} />);
        }}
      >
        Contactar
      </Button>
    </div>
  );
};
