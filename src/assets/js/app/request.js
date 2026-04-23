/*----------  LIBRARIES  ----------*/

import { feature } from 'topojson-client';

import { selectBoxSex } from './select-sex.js';

/*----------  REQUEST  ----------*/

// Small wrapper around fetch → JSON to keep call sites compact.
function loadJson(url) {
    return fetch(url).then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
        return res.json();
    });
}

export function request(dispatcher) {

    /*----------  TOPOJSON MAP  ----------*/

    //countries topojson
    let countries;

    //default data
    let data = {
        year: 2013,
        age_group_id: 38,
        sex_id: 3,
        metric: 'overweight'
    };

    loadJson('./assets/res/world-custom.json').then((world) => {

        //countries topojson
        countries = feature(world, world.objects.map).features;

        //populate other select boxes with options
        selectBoxSex(dispatcher);

        //emmiter when ready
        dispatcher.call('TOPOJSON_LOADED', this, countries); //used for map creation

    }).catch((err) => console.error(err));

    /*----------  DATA  ----------*/

    dispatcher.on('LOAD_DATA', function(newValue) {

        //replace defaults
        if (newValue) {
            for (let key in newValue) {
                data[key] = newValue[key];
            }
        }

        let { year, age_group_id, sex_id, metric } = data; //destructured assignment

        // Data originally came from a Firebase endpoint; it's now bundled as
        // static JSON mirroring the same path structure.
        let url = `./assets/res/data/${year}/${age_group_id}/${sex_id}/${metric}.json`;

        loadJson(url).then((countryData) => {
            //emmiter when ready
            dispatcher.call('DATA_LOADED', this, countryData);
        }).catch((err) => console.error(err));

    });

}
