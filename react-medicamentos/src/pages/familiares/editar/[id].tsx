"use client";

import FormFamiliar from "../../../components/familiares/form-familiar";
import { useRouter } from "next/router";
export default function EditarFamiliar() {
  const router = useRouter();
  const { id } = router.query;
  return (
      <FormFamiliar id={id}  />
    );
}
