import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { DatabaseService } from './../../services/database.service';
import { Item } from '../../shared/item';
import { FormBuilder, FormGroup, FormArray, FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. Source: https://material.angular.io/components/input/examples */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit {
  favorites: Item[];
  selectedItems = [];
  recipeName: string;
  categories$: string[];
  errorMessage: string;
  isError: boolean = false;

  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private databaseService: DatabaseService) { 
    this.favorites = this.itemService.getFavorites();
    // this.categories$ = this.databaseService.getCategories();
  }

  ngOnInit() {
    console.log("Current Favorites are", this.favorites);
  }

  addItem(selectedItem) {
    if (selectedItem.checked) {
      console.log('Adding item');
      this.selectedItems.push(selectedItem);
    } else {
      console.log('removing Item');
      /* Removed unchecked item from the array */
      this.selectedItems.map((item, index) => {
        if (selectedItem.id === item.id) {
          this.selectedItems.splice(index, 1);
    }
      })
    }
  }

  submitRecipe(name: string) {
    this.recipeName = name;
    if(this.selectedItems.length > 0 && this.recipeName !== undefined && this.recipeName.length > 0) {
      // Check if an error is present and reset it upon successful submission
      if(this.isError) {
        this.errorMessage = "";
        this.isError = false;
      }

      const newRecipe = {
        name: this.recipeName,
        items: this.selectedItems
      };
      console.log(newRecipe);
      this.itemService.addRecipe(newRecipe);
      this.resetRecipe();
    } else {
      //This code displays an error message
      this.isError = true;
      this.errorMessage = "This recipe is empty so you'll have to try again. Have you selected your items and given the recipe a name?"
    }
  }

  /* Function resets all checkboxes and empties the array after a recipe is submitted */
  resetRecipe() {
    // debugger
    this.favorites.map((item) => {
      item.checked = false;
    });
    this.selectedItems = [];
    console.log("Array submitted, recipe contents emptied.", this.selectedItems);
  }

}
