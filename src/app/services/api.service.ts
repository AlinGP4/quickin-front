import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  createCategory(api: string, body: {
    name: string,
    description?: string
  }) {
    return this.httpClient.post(api + '/categories', body)
  }

  updateCategory(api: string, body: {
    name?: string,
    description?: string,
    id: number
  }) {
    return this.httpClient.put(api + '/categories', body)
  }

  removeCategory(api: string, id: number) {
    return this.httpClient.delete(api + `/categories/${id}/`)
  }

  getCategories(api: string) {
    return this.httpClient.get(api + '/categories')
  }

  createProduct(api: string, body: {
    name: string,
    description: string,
    idCategory?: number,
    price: number
  }) {
    return this.httpClient.post(api + '/products', body)
  }

  updateProduct(api: string, body: {
    name: string,
    description: string,
    id: number
  }) {
    return this.httpClient.put(api + '/products', body)
  }

  removeProduct(api: string, id: number) {
    return this.httpClient.delete(api + `/products/${id}/`)
  }

  getProducts(api: string) {
    return this.httpClient.get(api + '/products')
  }
}
