import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCapsules, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

export default function CardFamiliar({ fam , medicamentos, sintomas}: any) {
  return (
    <>
      {fam ? (
        <div className="card-detalles">
          <div className="info-familiar">
            <div className="info-title-detalles">
              <FontAwesomeIcon icon={faUser} size="xl" />
              <p>
                 {fam.nombre} {fam.apellido}
              </p>
            </div>
            <div className="detalles-familiar">
              <p>Parentesco: {fam.parentesco}</p> <hr />
              <p>F. nacimiento: {format(new Date(fam.fecha_nacimiento), "dd-MM-yyyy")}</p> <hr />
              <p>Celular: {fam.celular}</p> <hr />
              <p>Correo: {fam.correo}</p>
            </div>
          </div>
          <div className="info-adicional">
            <div className="info-medicamentos">
              <div>
                <FontAwesomeIcon icon={faCapsules} size="xl" />
              </div>
              <div className="info-detalles-medicamentos">
                <label htmlFor=""> Historial de medicamentos</label> <br />
                <small> { medicamentos } medicamentos activos </small>
              </div>
            </div>
            <div className="info-emergencia">
              <div>
                <FontAwesomeIcon icon={faTriangleExclamation} size="xl" />
              </div>
              <div className="info-detalles-emergencias">
                <label htmlFor=""> Historial de emergencias</label> <br />
                <small> { sintomas } emergencias registradas </small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
