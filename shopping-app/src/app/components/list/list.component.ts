import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ItemService } from 'src/app/services/item.service';
import { Output, EventEmitter } from '@angular/core'; //For component interaction
import { Item } from './../../shared/item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
items$: Item[] = [];
// @Output() selectItem = new EventEmitter<Item>();
selectedItem: Item;
totalPrice;

  constructor(private dbs: DatabaseService, private itemService: ItemService, private router: Router) { 
    this.totalPrice = this.calculateTotalPrice();
  }

  ngOnInit() {
    this.items$ = this.dbs.retrieveItems();
    this.calculateTotalPrice();
    // this.retrieveTotalPrice();
    // console.log(typeof(this.totalPrice));
  }


  displayItem(itemData) {
    /* Display data with details at the top of the screen. May also be a drop down box */
    this.dbs.setSelectedItem(itemData);
    this.selectedItem = itemData;
    // this.selectItem.emit(itemData);
  }

  removeItem(event: Event, id, itemIndex) {
    /* Right now this just deletes the item based on the ID */
    event.stopPropagation(); //Setting the event to type Event lets you see the stopPropogation available for the method. See example here: https://www.radzen.com/blog/angular-event-bubbling/
    console.log('Removing item...', id);
    console.log("Index is: ", itemIndex);

    this.items$.map((item: Item, index) => {
      if(itemIndex === index) {
        this.updatePrice(item);
        this.items$.splice(itemIndex, 1);
      }
    })
  }

  editItem(event: Event, id) {
    event.stopPropagation();
    console.log('Editing item...', id);
    this.router.navigate([`items/${id}/edit`]);
  }

  favoriteItem(event: Event, item: Item) {
    event.stopPropagation();
    this.itemService.favoriteItem(item);
  }

  /* Method to calculate and retrieve the total price for each item on the list */
  calculateTotalPrice() {
    this.totalPrice = 0;
    this.items$.map((item) => {
      // console.log("item price list", item);
      // console.log(typeof item.price, item.price);
      this.totalPrice += item.price;
    });
  }

  updatePrice(item: Item) {
    /* Updates the price based on whether an item is added or removed. Right now it's just subtracting */
    this.totalPrice -= item.price;
  }

}
