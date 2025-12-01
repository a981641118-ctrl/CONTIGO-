"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";
import CardSintomas from "../components/sintomas/card-sintomas"
import { format } from 'date-fns';

export default function Sintomas() {

  const [data, setData] = useState([]);
    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sintomas`)
        .then((res) => res.json())
        .then((data) => mostrarRegistros(data))
        .catch((err) => console.error("Error al cargar registros:", err));
    }, []);
    const mostrarRegistros = (data: any) => {
      console.log(data)
      setData(data.map((e:any)=>{
        return {...e, fecha_inicio : format(new Date(e.fecha_inicio), 'dd/MM/yyyy')}
      }))
    }
  return (
    <main className="section-main">
      <div className="title-list">
        <h5> Lista de Síntomas </h5>
        <a className="btn-link" href="sintomas/nuevo">
          <FontAwesomeIcon icon={faPlus} size="sm" /> Agregar Síntoma
        </a>
      </div>
      { data.map((e, index) => (
        <CardSintomas data={e} key={index} />
      ))}
    </main>
  );
}

