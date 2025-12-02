"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import CardEmergenciaFamiliar from "../components/familiar-emergencia/card-emergencia-familiar";
import { format } from 'date-fns';

export default function InformacionEmergencia() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares`)
      .then((res) => res.json())
      .then((data) => asignarFamiliares(data))
      .catch((err) => console.error("Error al cargar familiares:", err));
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



  const [familiar, setFamiliar] = useState(null);
  const handleChange = (e: any) => {
    getInforFamiliar(e.target.value)
  };

  const getInforFamiliar = async (id:any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares/single/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      setFamiliar(data)
      console.log("Datos obtenidos:", data);
    } else {
      console.error("Error al obtener el registro");
      setFamiliar(null)

    }
  };

  return (
    <main className="section-main">
      <div className="title-center">
        <h5> Informacion de Emergencia </h5>
      </div>
      <div className="container-transparent">
        <div className="container-group">
          <label> Familiar </label>
          <div className="container-input">
            <select name="id_familiar" id="" className="form-select" onChange={handleChange} required>
              <option value=""> -Seleccione- </option>
              {opcionesFam.map((fam, index) => (
                <option key={index} value={fam.id_familiar}>
                  {fam.nombre}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div>
            <CardEmergenciaFamiliar fam={familiar} />
          </div>
        </div>
      </div>
    </main>
  );

}
