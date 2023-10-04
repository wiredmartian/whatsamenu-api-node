import { AxiosInstance } from "axios"
import { Restaurant } from "./restaurant"
import { Menu } from "./menu"
import { Allergen } from "./allergen"
import { Ingredient } from "./ingredient"
import { Auth } from "./auth"

export class MenuAPI {
    private http: AxiosInstance
    constructor(client: AxiosInstance) {
        this.http = client
    }
    get menuApi() {
        return {
            restaurant: new Restaurant(this.http),
            menu: new Menu(this.http),
            allergen: new Allergen(this.http),
            ingredient: new Ingredient(this.http),
            auth: new Auth(this.http),
            menuItem: null,
            menuGroup: null
        }
    }
}
