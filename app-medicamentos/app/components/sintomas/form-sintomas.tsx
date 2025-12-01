"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button, CircularProgress } from "@mui/material";

export default function FormMedicamentos({ id }: any) {
  const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
    id_familiar:'',
    tipo_sintoma:'',
    fecha_inicio:'',
    intensidad:'',
    comentarios:'',
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
      ...data,
      fecha_inicio : format(new Date(data.fecha_inicio), 'yyyy-MM-dd')
    });
  };
  const guardarRegistro = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sintomas/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      alert("Registro creado")
      location.reload()
    } else {
      console.error("Error al enviar datos");
    }
    setLoading(false);
  };
  const actualizarRegistro = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sintomas/edit/${id}`, {
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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sintomas/single/${id}`)
        .then((res) => res.json())
        .then((data) => setSingle(data))
        .finally(()=>{
          setLoading(false);
        })
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/familiares`)
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
    <div className="container">
      <form action="" onSubmit={handleSubmit}>
        <div className="container-group">
          <label> Familiar </label>
          <div className="container-input">
            <select
              name="id_familiar"
              id=""
              className="form-select"
              onChange={handleChange} required
            >
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
          <label> Tipo de síntoma </label>
          <div className="container-input">
            <input
              type="text"
              className="form-input"
              name="tipo_sintoma"
              value={formData.tipo_sintoma}
              onChange={handleChange} required
            />
            <span> * </span>
          </div>
        </div>
        <div className="container-double">
          <div className="container-group">
            <label> Fecha inicio </label>
            <div className="container-input">
              <input
                type="date"
                className="form-input"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange} required
              />
              <span> * </span>
            </div>
          </div>
          <div className="container-group">
            <label> Intensidad </label>
            <div className="container-input">
              <input
                type="radio"
                name="intensidad"
                id="radLeve"
                value="leve"
                checked={formData.intensidad === 'leve'}
                onChange={handleChange} required
              />
              <label htmlFor="radLeve">Leve</label>
              <input
                type="radio"
                name="intensidad"
                id="radModerado"
                value="moderado"
                checked={formData.intensidad === 'moderado'}
                onChange={handleChange} required
              />
              <label htmlFor="radModerado">Moderado</label>
              <input
                type="radio"
                name="intensidad"
                id="radSevero"
                value="severo"
                checked={formData.intensidad === 'severo'}
                onChange={handleChange} required
              />
              <label htmlFor="radSevero">Severo</label>
              <span> * </span>
            </div>
          </div>
        </div>
        <div className="container-group">
          <label> Comentarios adicionales </label>
          <div className="container-input">
            <textarea
              className="form-input"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange} required
            ></textarea>
            <span> * </span>
          </div>
        </div>
        <div className="container-msg">
          <span> * </span> Campos obligatorios
        </div>
        <div className="container-button">
          {/* <button className="btn-cancelar" type="button">
            Cancelar
          </button>
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
  );
}


