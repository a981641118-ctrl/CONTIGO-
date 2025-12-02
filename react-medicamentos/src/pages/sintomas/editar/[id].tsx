"use client";
import FormSintomas from "../../components/sintomas/form-sintomas";
import { useRouter } from "next/router";

export default function NuevoMedicamento() {
  const router = useRouter();
  const { id } = router.query;
  return(
    <main className="section-main">
      <h5> Sintomas </h5>
      <FormSintomas id={id} />;
    </main>
  )
}
