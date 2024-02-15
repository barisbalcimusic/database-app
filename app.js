/////////////////// IMPORTS ///////////////////
import readlineSync from "readline-sync";
import { Items } from "./data/classes.js";
import { col } from "./data/colors.js";
import { template } from "./data/templates.js";

/////////////////// DATABASE ///////////////////
let globalStorage = [
  { name: "Jackson", id: 4, type: "E-Guitar", quantity: 3, weight: 10 },
  { name: "Hannabach", id: 2, type: "Strings", quantity: 20, weight: 1 },
  { name: "Alhambra", id: 3, type: "Cl-Guitar", quantity: 7, weight: 25 },
  { name: "Savarez", id: 1, type: "Strings", quantity: 1, weight: 0.5 },
];

/////////////////// APP ///////////////////
function app() {
  const operation = readlineSync.question(
    `\nPlease select an operation (${col.g}C${col.res}reate, ${col.b}R${col.res}ead, ${col.y}U${col.res}pdate, ${col.r}D${col.res}elete or ${col.m}Q${col.res}uit):`
  );

  //show the list
  function list() {
    globalStorage.forEach((element) => {
      console.log(
        `ID: ${element.id}  |  Name: ${element.name}  |  Type: ${
          element.type
        }  |  Quantity: ${element.quantity}  |  Weight: ${
          element.weight
        } kg  |  Total weight: ${element.weight * element.quantity} kg `
      );
    });
  }

  switch (operation.toLowerCase()) {
    //C-reate
    case "c":
      console.log(
        `\n${col.g}You want to create something. Please enter the following values${col.res}`
      );
      const name = readlineSync.question("Name of the product: ");
      const type = readlineSync.question("Type of the product: ");

      //assign the id automatically (1 of the biggest ID in the list)

      let id = globalStorage.reduce((acc, curr) => {
        if (acc > curr.id) {
          return acc;
        } else {
          return curr.id;
        }
      }, 0);
      id++;

      // get quantity and check if number or not
      let quantity = null;
      do {
        if (quantity === null) {
          quantity = readlineSync.question("Quantity of the product: ");
        } else {
          console.log(
            `\n${col.y}Quantity must be a number and mustn't be empty!${col.res}`
          );
          quantity = readlineSync.question("Quantity of the product: ");
        }
      } while (isNaN(quantity) === true || quantity === "");

      // get weight and check if number or not
      let weight = null;
      do {
        if (weight === null) {
          weight = readlineSync.question("Weight of the product: ");
        } else {
          console.log(
            `\n${col.y}Weight must be a number and mustn't be empty!${col.res}`
          );
          weight = readlineSync.question("Weight of the product: ");
        }
      } while (isNaN(weight) === true || weight === "");

      // create a new instance with the new entries
      const create = new Items(
        name ? name : "unknown",
        id ? id : "unknown",
        type ? type : "unknown",
        quantity,
        weight
      );

      // push the created instance into the database
      globalStorage.push(create);

      console.log(
        `\n${col.g}You have successfully added the following product${col.res}:
ID: ${create.id}
Name: ${create.name}
Type: ${create.type}
Quantity: ${create.quantity}
Weight: ${create.weight} kg`
      );
      app(); // back to main menu
      break;

    //R-ead
    case "r":
      //OPTIONS: BACK OR SORT
      function options() {
        return readlineSync.question(
          `\nPress ${col.b}"B"${col.res} to go back to the main menu, ${col.b}"S"${col.res} for sorting the products: `
        );
      }

      console.log(`\n${col.b}You want to see your list: ${col.res}`);
      list(); // show the list

      const totalWeight = globalStorage.reduce(
        (acc, curr) => acc + curr.weight * curr.quantity,
        0
      );
      console.log(
        `${col.c}Total weight of all products: ${totalWeight}kg${col.res}`
      );

      //read - back or sort
      readOptions();
      function readOptions() {
        switch (options().toLowerCase()) {
          // back to main menu
          case "b":
            app();
            break;
          case "s":
            // sort
            const sortStrings = (input) => {
              globalStorage.sort((acc, curr) => {
                const compare = acc[input].localeCompare(curr[input]);
                return compare === -1 ? -1 : compare === 1 ? 1 : 0;
              });
              console.log(
                `\n${col.b}Here is the sorted list by ${input}:${col.res}`
              );
              list(); // show the list
              app(); // back to main menu
            };

            const sortNumbers = (input) => {
              globalStorage.sort((a, b) => a[input] - b[input]);
              console.log(
                `\n${col.b}Here is the sorted list by ${input}:${col.res}`
              );
              list(); // show the list
              app(); // back to main menu
            };

            sortOptions();
            function sortOptions() {
              // get the sort option
              let sort = readlineSync.question(
                `\nSort by ${col.b}N${col.res}ame, ${col.b}I${col.res}d, ${col.b}T${col.res}ype, ${col.b}Q${col.res}uantity or ${col.b}W${col.res}eight: `
              );
              switch (sort.toLowerCase()) {
                case "n":
                  sortStrings("name"); //sort by name
                  break;
                case "i":
                  sortNumbers("id"); //sort by id
                  break;
                case "t":
                  sortStrings("type"); //sort by type
                  break;
                case "q":
                  sortNumbers("quantity"); //sort by quantity
                  break;
                case "w":
                  sortNumbers("weight"); //sort by weight
                  break;
                default: //warning if the shortcut isn't valid
                  console.log(
                    `\n${col.y}That is not a valid shortcut!${col.res}`
                  );
                  sortOptions(); //start again
                  break;
              }
            }
            break;
          default: //warning if the shortcut isn't valid
            console.log(`\n${col.y}That is not a valid shortcut!${col.res}`);
            readOptions(); //start again
            break;
        }
      }
      break;

    //U-pdate
    case "u":
      console.log(`\n${col.y}You want to update something${col.res}`);
      // prompt the id
      const productIdUpd = readlineSync.question(
        "Enter the ID of the product you want to update: "
      );

      // find the index of the object with this id
      let productToUpdate = globalStorage.filter(
        (curr) => curr.id === Number(productIdUpd)
      );
      const indexUpd = globalStorage.indexOf(productToUpdate[0]);

      // show the product to update
      console.log(
        `\n${col.y}You want to update the following product:${col.res}`
      );
      console.log(
        `ID: ${productToUpdate[0].id}, Name: ${
          productToUpdate[0].name
        }, Type: ${productToUpdate[0].type}, Quantity: ${
          productToUpdate[0].quantity
        }, Weight: ${productToUpdate[0].weight} kg, Total weight: ${
          productToUpdate[0].weight * productToUpdate[0].quantity
        } kg `
      );

      // get the new values
      let newName = readlineSync.question("Enter a new name: ");
      let newType = readlineSync.question("Enter a new type: ");
      let newQuantity = readlineSync.question("Enter a new quantity: ");
      let newWeight = readlineSync.question("Enter a new weight: ");

      // replace the old object with the new one
      if (newName !== "") globalStorage[indexUpd].name = newName;
      if (newType !== "") globalStorage[indexUpd].type = newType;
      if (newQuantity !== "") globalStorage[indexUpd].quantity = newQuantity;
      if (newWeight !== "") globalStorage[indexUpd].weight = newWeight;

      // show updated product
      console.log(
        `\n${col.g}You have successfully updated your product:${col.res}`
      );
      console.log(
        `ID: ${globalStorage[indexUpd].id}, Name: ${
          globalStorage[indexUpd].name
        }, Type: ${globalStorage[indexUpd].type}, Quantity: ${
          globalStorage[indexUpd].quantity
        }, Weight: ${globalStorage[indexUpd].weight} kg, Total weight: ${
          globalStorage[indexUpd].weight * globalStorage[indexUpd].quantity
        } kg `
      );
      app(); // back to main menu
      break;

    //D-elete
    case "d":
      console.log(`\n${col.r}You want to delete something${col.res}`);
      list(); // show the list

      // prompt the id
      const productIdDel = readlineSync.question(
        "\nEnter the ID of the product you want to delete: "
      );

      // find the index of the object with this id
      let productToDelete = globalStorage.filter(
        (curr) => curr.id === Number(productIdDel)
      );
      const indexDel = globalStorage.indexOf(productToDelete[0]); // Achtung => Der Object is in ein Array gepackt, deswegen => [0]

      // show the product to delete
      console.log(
        `\n${col.r}You want to delete the following product:${col.res}`
      );
      console.log(
        `ID: ${productToDelete[0].id}, Name: ${
          productToDelete[0].name
        }, Type: ${productToDelete[0].type}, Quantity: ${
          productToDelete[0].quantity
        }, Weight: ${productToDelete[0].weight} kg, Total weight: ${
          productToDelete[0].weight * productToDelete[0].quantity
        } kg `
      );

      // check the answer and delete the product
      answerCheck();
      function answerCheck() {
        const check = readlineSync.question(
          `\nAre you sure? Press ${col.r}"y"${col.res} to delete, ${col.g}"n"${col.res} to go back to main menu: `
        );

        if (check.toLowerCase() === "y") {
          // delete the product
          let newStorage = globalStorage.filter(
            (curr) => curr.id !== Number(productIdDel)
          );

          // change the list
          globalStorage = newStorage;

          console.log(
            `\n${col.g}You have successfully deleted your product${col.res}`
          );
          app(); // back to main menu
        } else if (check.toLowerCase() === "n") {
          app(); // back to main menu
        } else {
          console.log(`\n${col.y}That is not a valid shortcut!${col.res}`);
          answerCheck(); // start the check again
        }
      }
      break;

    //Q-uit
    case "q":
      console.log(
        `\n${col.m}The application has been closed. Goodbye!${col.res}`
      );
      return;

    default:
      console.log(`${col.y}That is not a valid shortcut!${col.res}`);
      app(); // back to main menu
      break;
  }
}

//RUN THE APP
app();
