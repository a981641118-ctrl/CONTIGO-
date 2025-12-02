"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button, CircularProgress } from "@mui/material";

export default function FormMedicamentos({ id }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_familiar: "",
    nombre_medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion_tratamiento: "",
    fecha_registro: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && !isNaN(Number.parseInt(id))) {
      actualizarRegistro();
    } else {
      guardarRegistro();
    }
  };
  const setSingle = (data: any) => {
    setFormData({
      ...data
    });
  };
  const guardarRegistro = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicamentos/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      alert("Registro guardado")
      location.reload()
    } else {
      console.error("Error al enviar datos");
    }
    setLoading(false);
  };
  const actualizarRegistro = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicamentos/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      alert("Registro actualizado")
      location.reload()
    } else {
      console.error("Error al actualizar");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (id && !isNaN(Number.parseInt(id))) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicamentos/single/${id}`)
        .then((res) => res.json())
        .then((data) => setSingle(data))
        .finally(()=>{
          setLoading(false);
        })
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/amiliares`)
      .then((res) => res.json())
      .then((data) => asignarFamiliares(data))
      .catch((err) => console.error("Error al cargar familiares:", err));
  }, [id]);

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
  return (
    <main className="section-main">
      <h5> REGISTRO DE MEDICAMENTOS </h5>
      <div className="container">
        <form action="" onSubmit={handleSubmit}>
          <div className="container-group">
            <label> Familiar </label>
            <div className="container-input">
              <select name="id_familiar" id="" className="form-select" value={formData.id_familiar} onChange={handleChange} required>
                <option value=""> -Seleccione- </option>
                {opcionesFam.map((fam, index) => (
                  <option key={index} value={fam.id_familiar}>
                    {fam.nombre}
                  </option>
                ))}
              </select>
              <span> * </span>
            </div>
          </div>
          <div className="container-group">
            <label> Nombre del medicamento </label>
            <div className="container-input">
              <input
                type="text"
                className="form-input"
                name="nombre_medicamento"
                value={formData.nombre_medicamento}
                onChange={handleChange}
                placeholder="Ej: Paracetamol" required
              />
              <span> * </span>
            </div>
          </div>
          <div className="container-double">
            <div className="container-group">
              <label> {`Dosis (# de pastillas/toma)`} </label>
              <div className="container-input">
                <input
                  type="text"
                  className="form-input"
                  name="dosis"
                  value={formData.dosis}
                  onChange={handleChange}
                  placeholder="Ej: 1" required
                />
                <span> * </span>
              </div>
            </div>
            <div className="container-group">
              <label> Frecuencia </label>
              <div className="container-input">
                <select
                  name="frecuencia"
                  className="form-select"
                  value={formData.frecuencia}
                  onChange={handleChange}
                  required
                >
                  <option value=""> -Seleccione- </option>
                  <option value="8"> 8 horas </option>
                  <option value="12"> 12 horas </option>
                  <option value="24"> 24 horas </option>
                </select>
                <span> * </span>
              </div>
            </div>
          </div>
          <div className="container-group">
            <label> Duración </label>
            <div className="container-input">
              <input
                type="text"
                className="form-input"
                name="duracion_tratamiento"
                value={formData.duracion_tratamiento}
                onChange={handleChange}
                placeholder="Ej: 15" required
              />
              <span> * </span>
            </div>
          </div>
          <div className="container-msg">
            <span> * </span> Campos obligatorios
          </div>
          <div className="container-button">
            {/* <button className="btn-cancelar" type="button">Cancelar</button>
            <button className="btn-guardar"> Guardar </button> */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
