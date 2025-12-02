import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
export default function CardHistorial({ data }: any) {
  return (
    <div className="card-historial">
      <div className="card-icon">
        <span></span>
        <div></div>
      </div>
      <div className="card-content">
        {data.tipo == "sintoma" ? (
          <>
            <div className="card-content-title">
              <h5> {data.descripcion} </h5>
              <span className="span-medicamento"> SINTOMA </span>
            </div>
            <small> {data.fecha}</small>
            <div> {data.intensidad} - {data.comentarios}</div>
          </>
        ) : (
          <>
            <div className="card-content-title">
              <h5> {data.descripcion} </h5>
              <span className="span-sintoma"> MEDICAMENTO </span>
            </div>
            <small> {data.fecha}</small>
            <div> {data.dosis} - {data.frecuencia}</div>
          </>
        )}
      </div>
    </div>
  );
}
