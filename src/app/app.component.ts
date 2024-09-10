import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from "./shared/components/button/button.component";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { Category, Product } from './core/global.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonComponent, CommonModule, FormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'front';
  api = 'http://localhost:3000';
  button$: Subject<'nestjs' | 'nodejs' | 'symfony'> = new BehaviorSubject<'nestjs' | 'nodejs' | 'symfony'>('nestjs');

  formCategory: Category = {
    name: '',
    description: '',
    id: 0
  }

  formProduct = {
    name: '',
    description: '',
    price: 0,
    idCategory: -1,
    id: 0
  }

  listCategories: Category[] = []
  listProducts: Product[] = [];

  constructor(
    private apiService: ApiService
  ) {
    this.getAllData();
    this.button$.subscribe({
      next: (api: 'nestjs' | 'nodejs' | 'symfony') => {
        switch (api) {
          case 'symfony':
            this.api = 'http://localhost:8000/api'
            break;
          default:
            this.api = 'http://localhost:3000'
            break;
        }
      }
    })
  }

  getAllData(getData?: 'category' | 'products') {
    if (getData == 'category' || !getData) this.apiService.getCategories(this.api).subscribe({
      next: (res: any) => {
        this.listCategories = res.data;
      }
    })

    if (getData == 'products' || !getData) this.apiService.getProducts(this.api).subscribe({
      next: (res: any) => {
        this.listProducts = res.data;
      }
    })
  }

  handleUpdateButton(select: 'nestjs' | 'nodejs' | 'symfony') {
    this.button$.next(select)
  }

  handleCreateCategory() {
    const body = {
      name: this.formCategory.name,
      description: this.formCategory.description,
    }
    this.apiService.createCategory(this.api, body).subscribe({
      next: (res: any) => {
        this.listCategories.push({
          ...body,
          id: res.data.id
        })

        this.formCategory = {
          description: '',
          name: '',
          id: 0
        }
      }
    })
  }

  handleActiveUpdateCategory(id: number) {
    this.formCategory = {
      ...this.listCategories.find(el => el.id == id) as Category
    };
  }

  handleUpdateCategory() {
    const indexCategory = this.listCategories.findIndex(el => el.id == this.formCategory.id);
    this.apiService.updateCategory(this.api, this.formCategory).subscribe({
      next: () => {
        this.listCategories[indexCategory] = { ...this.formCategory };
        this.formCategory = {
          description: '',
          name: '',
          id: 0
        }
      }
    })
  }

  handleRemoveCategory(id: number) {
    this.apiService.removeCategory(this.api, id).subscribe({
      next: () => {
        this.listCategories = this.listCategories.filter((el) => el.id != id);
        this.listProducts = this.listProducts.filter((el) => el.category?.id != id);
      }
    })
  }

  handleCreateProduct() {
    const body = {
      name: this.formProduct.name,
      description: this.formProduct.description,
      idCategory: this.formProduct.idCategory,
      price: this.formProduct.price
    }

    this.apiService.createProduct(this.api, body).subscribe({
      next: (res: any) => {
        this.listProducts.push({
          ...body,
          category: this.listCategories.find((el) => el.id == body.idCategory),
          id: res.data.id
        })

        this.formProduct = {
          name: '',
          description: '',
          price: 0,
          idCategory: -1,
          id: 0
        }
      }
    })
  }

  handleActiveUpdateProduct(id: number) {
    const parseData = this.listProducts.find(el => el.id == id) as {
      name: string;
      description: string;
      price: number;
      idCategory: number;
      id: number;
      category: Category
    };

    this.formProduct = {
      ...parseData,
      idCategory: parseData.category?.id ?? -1
    };
    console.log(this.formProduct)
  }

  handleUpdateProduct() {
    const indexProduct = this.listProducts.findIndex(el => el.id == this.formProduct.id);
    this.apiService.updateProduct(this.api, this.formProduct).subscribe({
      next: () => {
        console.log(this.formProduct)
        this.listProducts[indexProduct] = { ...this.formProduct, category: this.listCategories.find((el) => el.id == this.formProduct.idCategory) };
        this.formProduct = {
          name: '',
          description: '',
          price: 0,
          idCategory: -1,
          id: 0
        }
      }
    })
  }

  handleRemoveProduct(id: number) {
    this.apiService.removeProduct(this.api, id).subscribe({
      next: () => {
        this.listProducts = this.listProducts.filter((el) => el.id != id);
      }
    })
  }
}
