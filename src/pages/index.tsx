import React from "react";
import { type NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type UserCreation, UserCreationSchema } from "~/schemas/user";
import Form from "~/lib/Form";
import { api } from "~/utils/api";
import Button from "~/lib/Button";
import { toast } from "react-hot-toast";

const Home: NextPage = () => {
  const methods = useForm<UserCreation>({
    resolver: zodResolver(UserCreationSchema),
  });
  const { mutate: createUser, isLoading } = api.users.create.useMutation();
  return (
    <div className="mx-auto">
      <Form
        methods={methods}
        onSubmit={(data) => {
          createUser(data, {
            onSuccess: () => alert("success"),
            onError: () => alert("error"),
            // onSettled: () => alert(1),
          });
          /* toast.promise(async () => undefined, {
            loading: "Creando usuario",
            success: "Usuario creado",
            error: "Error al crear usuario",
          }); */
        }}
      >
        <Form.Input path="name" label="Nombre" />
        <Form.Input path="password" label="Contrase" />
        <Form.Input path="email" label="Email" />
        <Form.Input path="role" label="role" />
        <Button>Crear</Button>
      </Form>
    </div>
  );
};

export default Home;
