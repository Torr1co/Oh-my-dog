import React, { useState } from "react";
import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Form from "~/lib/Form";
import { useForm } from "react-hook-form";
import Button from "~/lib/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "~/lib/Typo/Title";
import Box from "~/lib/Box";
import { Blob, Blob2 } from "~/lib/icons";
import { toast } from "react-hot-toast";

const AuthSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(8, "Minimo 8 caracteres"),
});
type Auth = z.infer<typeof AuthSchema>;

const SignIn: NextPage = () => {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);

  const methods = useForm<Auth>({
    resolver: zodResolver(AuthSchema),
  });
  return (
    <div className="relative mx-auto max-w-xl">
      <div className="absolute -bottom-24 -left-28">
        <Blob />
      </div>
      <div className="absolute -top-24 -right-24">
        <Blob2 />
      </div>
      <Box className=" relative z-30 bg-white shadow-xl" kind={Box.KINDS.basic}>
        <Form
          methods={methods}
          onSubmit={async (data) => {
            if (!data.email || !data.password) return console.log("no data");
            setLoading(true);

            await signIn("credentials", {
              ...data,
              callbackUrl: "/",
            }).then((res) => {
              if (res && !res.ok) {
                if (res?.status === 401) {
                  toast.error("Credenciales invalidas");
                }
                toast.error("Error al iniciar sesion");
              }
            });
            setLoading(false);
          }}
          className="flex flex-col gap-6"
        >
          <Title>Bienvenido de vuelta!</Title>
          <Form.Input
            label="Email"
            className="bg"
            path="email"
            placeholder="usuario@email.com"
          />
          <Form.Input
            label="Contraseña"
            type="password"
            className="test"
            placeholder="Escibe tu contraseña"
            path="password"
          />
          <div>
            <Button type="submit" disabled={loading}>
              Iniciar Sesion
            </Button>
          </div>
        </Form>
      </Box>
    </div>
  );
};

export default SignIn;
