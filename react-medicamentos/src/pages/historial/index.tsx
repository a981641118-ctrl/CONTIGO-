"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import CardHistorial from "../components/historial/card-historial";
import CardEmergenciaFamiliar from "../components/historial/card-emergencia-familiar";

export default function Historial() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares`)
      .then((res) => res.json())
      .then((data) => asignarFamiliares(data))
      .catch((err) => console.error("Error al cargar familiares:", err));

    // fetch("http://localhost:4000/historial")
    //   .then((res) => res.json())
    //   .then((data) => mostrarRegistros(data))
    //   .catch((err) => console.error("Error al cargar el historial:", err));
  }, []);

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
    getData(e.target.value)
  };
  const [familiar, setFamiliar] = useState(null);

  const getData = async (id:any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares/historial/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      setFamiliar(data)      
      mostrarRegistros(data.registros)
      console.log("Datos obtenidos:", data);
    } else {
      console.error("Error al obtener el registro");
      mostrarRegistros([])
      setFamiliar(null)
    }
  };

  const mostrarRegistros = (data: any) => {
    console.log(data);
    setData(
      data.map((e: any) => {
        return {
          ...e,
          fecha: format(new Date(e.fecha), "dd/MM/yyyy"),
        };
      })
    );
  };
  return (
    <main className="section-main">
      <div className="title-list">
        <h5> Historial Clinico </h5>
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
      <br />
      <CardEmergenciaFamiliar fam={familiar} />
      <div className="container-cards">
        {data.map((e, index) => (
          <CardHistorial data={e} key={index} />
        ))}
      </div>
    </main>
  );
}

