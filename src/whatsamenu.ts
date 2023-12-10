import { AxiosInstance } from "axios"
import { Restaurant } from "./restaurant"
import { Menu } from "./menu"
import { Allergen } from "./allergen"
import { Ingredient } from "./ingredient"
import { MenuItem } from "./menuitem"
import { MenuGroup } from "./menugroup"
import { Auth } from "./auth"

export class MenuAPI {
    private http: AxiosInstance
    constructor(client: AxiosInstance) {
        this.http = client
    }
    get menuApi() {
        return {
            auth: new Auth(this.http),
            restaurant: new Restaurant(this.http),
            menu: new Menu(this.http),
            allergen: new Allergen(this.http),
            ingredient: new Ingredient(this.http),
            menuItem: new MenuItem(this.http),
            menuGroup: new MenuGroup(this.http)
        }
    }
}
