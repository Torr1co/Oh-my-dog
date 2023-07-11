import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Form from "~/components/_common/Form";
import { TimeZoneOptions, VaccineOptions } from "~/schemas";
import { type UrgencySchema } from "~/schemas/urgencySchema";
import { api } from "~/utils/api";
import CastrationCompletionForm from "./CastrationCompletionForm";
import DewormingCompletionForm from "./DewormingCompletionForm";
/* import CastrationInfo from "../BookingInfo/CastrationInfo";
import DewormingInfo from "../BookingInfo/DewormingInfo";
import VaccineInfo from "../BookingInfo/VaccineInfo"; */
import GeneralCompletionForm from "./GeneralCompletionForm";
import VaccineCompletionForm from "./VaccineCompletionForm";
import { VaccineType } from "@prisma/client";

export default function UrgencyForm() {
  const methods = useFormContext<UrgencySchema>();
  const { data: clients = [] } = api.clients.getAll.useQuery();
  const clientId = methods.watch("urgency.clientId");
  const { data: client } = api.clients.getById.useQuery({ id: clientId });
  const pets = client?.dogs ?? [];
  const petId = methods.watch("urgency.petId");
  const payAmount = (methods.watch("payAmount") as number | undefined) ?? 0;
  const discountAmount = client?.discountAmount ?? 0;
  const payWithDiscount =
    payAmount - discountAmount <= payAmount / 2
      ? payAmount / 2
      : payAmount - discountAmount;

  useEffect(() => {
    if (!petId || !clientId) {
      methods.setValue("general.height", undefined);
      methods.setValue("weight", undefined);
    }
  }, [petId, clientId]);
  return (
    <div className="grid gap-6">
      <Form.Select
        path="timeZone"
        label="Zona horaria"
        values={TimeZoneOptions}
      />
      <Form.Select
        path="urgency.clientId"
        label="Cliente de la urgencia"
        values={[
          {
            label: "Ninguno",
            value: null,
          },
          ...clients.map((client) => ({
            value: client.id,
            label: `${client.name} ${client.lastname}`,
          })),
        ]}
        onChange={(value) => {
          if (!value) {
            methods.setValue("urgency.petId", undefined);
          }
        }}
      />
      {clientId && (
        <Form.Select
          path="urgency.petId"
          label="Perro de la urgencia"
          values={pets
            .filter((pet) => !pet.disabled)
            .map((pet) => ({
              value: pet.id,
              label: pet.name,
            }))}
        />
      )}
      {(!petId ||
        (petId && !pets.find((pet) => pet.id === petId)?.castrated)) && (
        <Form.Toggle
          path="urgency.enableCastration"
          label="Sucedio una castracion"
          required
          onChange={(value) => {
            if (!value) {
              methods.setValue("castration", undefined);
            }
            else{
              methods.setValue("castration.succesful", false);
            }
          }}
        />
      )}
      <Form.Toggle
        path="urgency.enableVaccine"
        label="Sucedio una vacunacion"
        required
        onChange={(value) => {
          if (!value) {
            methods.setValue("vaccine", undefined);
            methods.setValue("vaccineType", undefined);
          } else {
            methods.setValue("vaccineType", VaccineType.A);
          }
        }}
      />
      <Form.Toggle
        path="urgency.enableDeworming"
        label="Sucedio una desparasitacion"
        required
        onChange={(value) => {
          if (!value) {
            methods.setValue("deworming", undefined);
          }
        }}
      />
      <Form.Number
        path="payAmount"
        label="Costo del turno"
        min={0}
        onChange={(e) => {
          methods.setValue(
            "payAmount",
            +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
          );
        }}
        required
      />
      {!!client?.discountAmount &&
        `El monto con descuento es de $${payWithDiscount}`}

      {!!petId ? (
        <>
          <GeneralCompletionForm />
          <Form.Number
            path="weight"
            label="Peso (kg)"
            min={0}
            onChange={(e) => {
              methods.setValue(
                "weight",
                +parseFloat(e.target.value.replace(/[^\d.\s]/g, "")).toFixed(2)
              );
            }}
            required
          />
        </>
      ) : (
        <Form.TextArea path="general.observations" label="Observaciones" />
      )}
      <hr />
      {methods.watch("urgency.enableCastration") && (
        <CastrationCompletionForm />
      )}
      {methods.watch("urgency.enableVaccine") && (
        <>
          <VaccineCompletionForm />
          <Form.Select
            path="vaccineType"
            label="Tipo de Vacuna"
            values={VaccineOptions}
          />
        </>
      )}
      {methods.watch("urgency.enableDeworming") && <DewormingCompletionForm />}
    </div>
  );
}
