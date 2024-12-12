  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  export interface PlacaDatos {
    nomEmpresaTransporte: string;
    zonatrabajo: string;
    placa: string;
    tipodocPropietario: string;
    docPropietario: string;
    conductor: string;
    dniConductor: string;
    licenciaConductor: string;
    verAfiliado: string;
    usuarioCreacion: string;
    activo: string;
    padron: string;
  }

  @Injectable({
    providedIn: 'root',
  })
  export class PlacaService {
    private apiUrl =
      'https://webapp.mdsmp.gob.pe/viajesegurobackend/public/v1/sigta/consultarplaca';

    constructor(private http: HttpClient) {}

    // Usamos el método POST para enviar la solicitud
    consultarPlaca(placa: string): Observable<PlacaDatos[]> {
      return this.http.post<PlacaDatos[]>(this.apiUrl, { placa: placa });
    }
    
  }
