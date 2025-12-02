"use client";
import { useEffect, useState } from "react";
import CardFamiliar from "../../components/familiares/card-familiar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { format } from 'date-fns';
import { CircularProgress } from "@mui/material";

export default function Familiares() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares`)
      .then((res) => res.json())
      .then((data) => mostrarRegistros(data))
      .catch((err) => console.error("Error al cargar familiares:", err))
      .finally(()=> setLoading(false))
  }, []);
  const mostrarRegistros = (data: any) => {
    console.log(data)
    setData(data.map((e:any)=>{
      return {...e, fecha_nacimiento : format(new Date(e.fecha_nacimiento), 'dd/MM/yyyy')}
    }))
  }
  
  return (
    <main className="section-main">
    <div className="title-list">
        <h5> Monitoreo familiar </h5>
        <a className="btn-link" href="familiares/nuevo">
        <FontAwesomeIcon icon={faPlus} size="sm" /> Agregar Familiar
        </a>
    </div>
    { loading && (
        <div className="text-center">
        <CircularProgress size={20} />
        </div>
        )
    }
    { data.map((fam, index) => (
        <CardFamiliar fam={fam} key={index} />
    ))}
    </main>
  );
}
