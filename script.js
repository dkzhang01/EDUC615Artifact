import {Model} from "./model.js";
import {View} from "./view.js";


let model = new Model();
let view = new View(model);

view.render(document.getElementById('main'));