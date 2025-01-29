export class Model {
    #position
    #ladders
    #snakes
    constructor() {
        this.#position = 1
        this.#ladders = {
            12: 33, 
            4: 13, 
            8: 27, 
            36: 57, 
            20: 39, 
            42: 71,
            54: 74,
            58: 79,
            83: 96  
        };

        this.#snakes = {
            16: 3,
            29: 9, 
            35: 17, 
            87: 24, 
            60: 38,
            73: 51,
            98: 80,
            91: 72
        };
    }
    get_snakes() {
        return this.#snakes;
    }
    get_ladders() {
        return this.#ladders;
    }
    get_position() {
        return this.#position
    }
    move_position(n) {
        this.#position = this.#position += n;
        if (this.#position >= 100) {
            this.#position = 100;
            document.dispatchEvent(new Event("model update"))
            document.dispatchEvent(new Event("game finish"));
        }
        // LOGIC FOR LADDERS AND SNAKES
        while (Object.keys(this.#ladders).includes(this.#position.toString()) || Object.keys(this.#snakes).includes(this.#position.toString())) {
            if (Object.keys(this.#ladders).includes(this.#position.toString())) {
                this.#position = this.#ladders[this.#position]
            } else {
                this.#position = this.#snakes[this.#position]
            }
        }
        document.dispatchEvent(new Event("model update"))
    }
}