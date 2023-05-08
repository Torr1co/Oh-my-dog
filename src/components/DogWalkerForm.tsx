import React from "react";
import Form from "~/lib/Form";
import { useForm } from "react-hook-form";

export default function DogWalkerForm() {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form
      methods={methods}
      onSubmit={(data) => {
        console.log(data);
      }}
    >
      DogWalkerForm
      <Form.Input className="bg" path="email" placeholder="Enterr your name" />
      <Form.Input type="password" className="test" path="password" />
    </Form>
  );
}
