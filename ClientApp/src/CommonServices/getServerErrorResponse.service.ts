import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { HTTPResponseStatus } from 'src/Helpers/constants';
import { ModelStateErrors } from 'src/Interfaces/interfaces';
import { Category } from 'src/models.model';
import { UpdateCATEGORY_Sucess } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys } from 'src/State/CategoriesState/Category.reducer';

@Injectable({
  providedIn: 'root'
})

export class GetServerErrorResponseService
{
  allCats$ = this.store.select(selectAllCategorys);
  allCats: Category[] = [];
  constructor(private store: Store)
  {
    this.allCats$.subscribe(cats => this.allCats = cats);

  }
  GetModelStateErrors(ModelStateErrors: any): ModelStateErrors[]
  {
    let errors: ModelStateErrors[] = [];
    let keys = Object.keys(ModelStateErrors);
    for (let k of keys)
    {
      for (let e of ModelStateErrors[k])
      {
        errors.push({ key: k, message: e });
      }
    }
    return errors;
  }
  GetIdentityErrors(identityErrors: any[]): ModelStateErrors[]
  {
    let errors: ModelStateErrors[] = [];

    for (let e of identityErrors)
    {
      if (e.code === "InvalidToken") continue;
      errors.push({ key: e.code, message: e.description });
    }

    return errors;
  }

  GetServerSideValidationErrors(e: any): ModelStateErrors[]
  {
    let errors: ModelStateErrors[] = [];
    if (e["error"])
      if (e["error"]["errors"] != null || e["error"]["errors"] != undefined)
        errors.push(...this.GetModelStateErrors(e.error.errors));
      else if (e.error.status === HTTPResponseStatus.identityErrors)
      {
        errors.push(...this.GetIdentityErrors(e.error.message));
      }
      else if (e.error.status !== 400)
      {
        errors.push({ key: e.error.status, message: e.error.message });
      }
    return errors;
  }
  updateCategoryLevelInStore(category: Category)
  {
    debugger;

    let children: Category[] = [];
    for (let cat of this.allCats)
    {
      if (cat.parentKey === category.id)
      {
        children.push(cat);
      }
    }
    if (children.length > 0)
    {
      children.forEach(child =>
      {
        let ch = new Category();
        ch = { ...child, level: category.level! + 1 };
        let x: Update<Category> = {
          id: child.id,
          changes: ch
        };
        this.store.dispatch(UpdateCATEGORY_Sucess({ CATEGORY: x }));
        this.updateCategoryLevelInStore(child);
      });
    }
  }
}
