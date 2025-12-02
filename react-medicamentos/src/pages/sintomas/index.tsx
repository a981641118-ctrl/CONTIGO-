"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import CardSintomas from "../../components/sintomas/card-sintomas";
import { format } from "date-fns";

export default function Sintomas() {
  const [data, setData] = useState([]);
 useEffect(() => {
    getData("");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares`)
      .then((res) => res.json())
      .then((data) => asignarFamiliares(data))
      .catch((err) => console.error("Error al cargar familiares:", err));
  }, []);
  const mostrarRegistros = (data: any) => {
    console.log(data);
    setData(
      data.map((e: any) => {
        return {
          ...e,
          fecha_inicio: format(new Date(e.fecha_inicio), "dd/MM/yyyy"),
        };
      })
    );
  };

  const [opcionesFam, setOpcionesFam] = useState([
    { id_familiar: "", nombre: "Cargando..." },
  ]);

  const asignarFamiliares = (data: any) => {
    console.log(data);
    setOpcionesFam(
      data.map((e: any) => {
        return e;
      })
    );
  };
  const handleChange = (e: any) => {
    getData(e.target.value);
  };

  const getData = (id = "") => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sintomas?familiar_id=` + id)
      .then((res) => res.json())
      .then((data) => mostrarRegistros(data))
      .catch((err) => console.error("Error al cargar medicamentos:", err));
  };
  return (
    <main className="section-main">
      <div className="title-list">
        <h5> Lista de Síntomas </h5>
        <a className="btn-link" href="sintomas/nuevo">
          <FontAwesomeIcon icon={faPlus} size="sm" /> Agregar Síntoma
        </a>
      </div>
      <div className="container-input">
        <select
          name="id_familiar"
          id=""
          className="form-select"
          onChange={handleChange}
          required
        >
          <option value=""> -Seleccione- </option>
          {opcionesFam.map((fam, index) => (
            <option key={index} value={fam.id_familiar}>
              {fam.nombre}
            </option>
          ))}
        </select>
      </div>
      {data.map((e, index) => (
        <CardSintomas data={e} key={index} />
      ))}
    </main>
  );
}
