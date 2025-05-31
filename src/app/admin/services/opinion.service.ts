// src/app/services/opinion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Opinion, OpinionCreate } from '../models/opinion.model';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  /**
   * Podstawowy URL do Waszego FastAPI.
   * Zgodnie z kodem backendu prefix to: /opinion/mobile
   */
  private baseUrl = 'http://localhost:8000/opinion/mobile';

  constructor(private http: HttpClient) {}

  /**
   * GET /opinion/mobile/get_all_opinions
   */
  getAllOpinions(): Observable<Opinion[]> {
    const url = `${this.baseUrl}/get_all_opinions`;
    return this.http.get<Opinion[]>(url);
  }

  /**
   * POST /opinion/mobile/add_opinion
   */
  addOpinion(data: OpinionCreate): Observable<Opinion> {
    const url = `${this.baseUrl}/add_opinion`;
    return this.http.post<Opinion>(url, data);
  }

  /**
   * PUT /opinion/mobile/update_opinion?opinion_id={id}
   * FastAPI w sygnaturze „update_opinion(opinion_id: str, opinion_data: OpinionCreate)”.
   * Dlatego `opinion_id` wysyłamy jako parametr querystring, a ciało to OpinionCreate.
   */
  updateOpinion(opinionId: string, data: OpinionCreate): Observable<Opinion> {
    const url = `${this.baseUrl}/update_opinion`;
    const params = new HttpParams().set('opinion_id', opinionId);
    return this.http.put<Opinion>(url, data, { params });
  }

  /**
   * DELETE /opinion/mobile/delete_opinion/{opinion_id}
   */
  deleteOpinion(opinionId: string): Observable<void> {
    const url = `${this.baseUrl}/delete_opinion/${opinionId}`;
    return this.http.delete<void>(url);
  }
}
