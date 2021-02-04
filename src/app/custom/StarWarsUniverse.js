import Starship from "./Starship";

export default class StarWarsUniverse {
    constructor() {
        this.starships = [];
    }

    async init() {
        await this._getStarshipCount();
        await this._createStarships();
        this.theBestStarship;
    }

    async _getStarshipCount() {
        const response = await fetch('https://swapi.dev/api/starships/');
        const data = await response.json();
        return data.count;
    }

    async _createStarships() {

        const starshipCount = await this._getStarshipCount();
        let currentShip = 0;
        //let validStarships = 0;

        while (currentShip /*validStarship*/ < parseInt(starshipCount)) {
            const response = await fetch(`https://swapi.dev/api/starships/${currentShip}`);

            if (!response.ok) {
                currentShip++;
                continue;
            }

            const data = await response.json();

            if (this._validateData(data)) {
                const starship = new Starship(data.name, this._parseConsumablesData(data.consumables), this._parsePassengerData(data.passengers));
                this.starships.push(starship);
                //console.log(starship);
            }
            //validStarships++;
            currentShip++;
        }
    }

    get theBestStarship() {

        let bestStarship;
        let maxDaysInSpace = 0;

        this.starships.forEach(starship => {
            if(starship.maxDaysInSpace > maxDaysInSpace){
                bestStarship = starship;
                maxDaysInSpace = starship.maxDaysInSpace;
            }
        });

        //console.log(bestStarship);
        //console.log(this.starships);
        return bestStarship;
    }

    _validateData(ship) {
        if (typeof ship.consumables === undefined || typeof ship.consumables === null || ship.consumables === 'unknown') {
            return false;
        } else if (typeof ship.passenger === undefined || typeof ship.passengers === null || ship.passengers === 'unknown'|| ship.passengers === '0' || ship.passengers === 'n/a') {
            return false;
        } else return true;
    }

    
    _parseConsumablesData(data){
        const splitted = data.split(" ");
        const parsedData = parseInt(splitted[0]) * this.getDays(splitted[1]);
        return parsedData;
    }

    _parsePassengerData(data){
        return data.replace(',','');
    }

    getDays(word){
        const type = {
            'year': 365,
            'years': 365,
            'month': 30,
            'months': 30,
            'days': 1
        }

        for(const property in type){
            if(word === property)
            return type[property];
        }


    }
}

