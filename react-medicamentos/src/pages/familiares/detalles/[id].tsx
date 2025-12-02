"use client";
import DetallesFamiliar from "../../../components/familiares/detalles-familiar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DetalleFamiliar() {
  const router = useRouter();
  const { id } = router.query;
  const [familiar, setFamiliar] = useState({ familiar: null,count_medicamentos : 0, count_sintomas:0 });
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares/single/` + id)
      .then((res) => res.json())
      .then((data) => {
          setFamiliar(data)
          console.log(data)
        }
      )
      .catch((err) => console.error("Error al cargar familiares:", err));
  }, [id]);

  return (
    <main className="section-main">
      <DetallesFamiliar fam={familiar.familiar} medicamentos={familiar.count_medicamentos} sintomas={familiar.count_sintomas}  />
    </main>
  );
}
