"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function ModalEmergencia() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="profile-emergencia">
        <button onClick={() => setOpen(true)}> EMERGENCIA </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" >
        <DialogTitle className="text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} size="xl" color="red" /> 
        </DialogTitle>
        <DialogContent className="modal-emergencia-content">
          <h4> Contacto de emergencia  </h4>
          <h6> Maria Garcia </h6>
          <h2>+51 987 654 321</h2>
        </DialogContent>
        <DialogActions className="modal-emergencia-buttons">
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
          <Button onClick={() => setOpen(false)}>Llamar ahora</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
