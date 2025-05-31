// src/app/services/special-offer.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SpecialOffer,
  SpecialOfferCreate,
  SpecialOfferUpdate,
} from '../models/special-offer';

@Injectable({
  providedIn: 'root',
})
export class SpecialOfferService {
  /**
   * Bazowy URL do FastAPI dla „special_offer/panel”.
   * Dostosuj host:port, jeżeli Twój backend działa gdzie indziej.
   */
  private baseUrl = 'http://localhost:80/special_offer/panel';

  constructor(private http: HttpClient) {}

  /**
   * GET /special_offer/panel/all
   */
  getAllOffers(): Observable<SpecialOffer[]> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<SpecialOffer[]>(url);
  }

  /**
   * GET /special_offer/panel/{offer_id}
   */
  getOfferById(offerId: string): Observable<SpecialOffer> {
    const url = `${this.baseUrl}/${offerId}`;
    return this.http.get<SpecialOffer>(url);
  }

  /**
   * POST /special_offer/panel/create
   */
  createOffer(data: SpecialOfferCreate): Observable<SpecialOffer> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<SpecialOffer>(url, data);
  }

  /**
   * PUT /special_offer/panel/{offer_id}
   */
  updateOffer(
    offerId: string,
    data: SpecialOfferUpdate
  ): Observable<SpecialOffer> {
    const url = `${this.baseUrl}/${offerId}`;
    return this.http.put<SpecialOffer>(url, data);
  }

  /**
   * DELETE /special_offer/panel/{offer_id}
   */
  deleteOffer(offerId: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/${offerId}`;
    return this.http.delete<{ message: string }>(url);
  }

  /**
   * POST /special_offer/panel/restaurant/{restaurant_id}/offer/{offer_id}
   */
  addOfferToRestaurant(
    restaurantId: string,
    offerId: string
  ): Observable<{ message: string }> {
    const url = `${this.baseUrl}/restaurant/${restaurantId}/offer/${offerId}`;
    return this.http.post<{ message: string }>(url, null);
  }

  /**
   * DELETE /special_offer/panel/restaurant/{restaurant_id}/offer/{offer_id}
   */
  removeOfferFromRestaurant(
    restaurantId: string,
    offerId: string
  ): Observable<{ message: string }> {
    const url = `${this.baseUrl}/restaurant/${restaurantId}/offer/${offerId}`;
    return this.http.delete<{ message: string }>(url);
  }
}
