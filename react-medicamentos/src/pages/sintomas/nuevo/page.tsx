"use client";
import { useEffect, useState } from "react";
import FormSintomas from "../../components/sintomas/form-sintomas";

export default function NuevoSintoma() {
  return (
    <main className="section-main">
      <h5> Sintomas </h5>
      <FormSintomas />
    </main>
  );
}
