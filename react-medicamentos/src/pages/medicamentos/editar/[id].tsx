"use client";
import FormMedicamentos from "../../../components/medicamentos/form-medicamentos";
import { useRouter } from "next/router";

export default function NuevoMedicamento() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <FormMedicamentos id={id}  />
  );
}