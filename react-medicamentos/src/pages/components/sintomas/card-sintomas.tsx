import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Chip from '@mui/material/Chip';
export default function CardSintomas({ data }: any) {
  const eliminarRegistro = async (id: Number) => {
    var a = confirm("¿Eliminar registro?");
    if (a) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sintomas/delete/` + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        alert("Registro eliminado")
        location.reload()
      } else {
        console.error("Error al enviar datos");
      }
    }
  };

  function colorIntensidad(intensidad: string) {
    switch (intensidad) {
      case 'leve':
        return 'success';
      case 'moderado':
        return 'warning';
      case 'severo':
        return 'error';
      default:
        return '';
    }
  }

  return (
    <div className="card">
      <div className="card-text">
        <div style={{ display: 'flex'}}>
          <label htmlFor="" style={{ marginRight: "10px" }}>
            {data.tipo_sintoma}
          </label>
          <Chip label={data.intensidad} color={colorIntensidad(data.intensidad)} />
        </div>
        <p> {data.fecha_inicio} </p>
      </div>
      <div className="card-actions">
        <a href={`sintomas/editar/${data.id_sintoma}`}>
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </a>
        <a onClick={() => eliminarRegistro(data.id_sintoma)}>
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </a>
      </div>
    </div>
  );
}
