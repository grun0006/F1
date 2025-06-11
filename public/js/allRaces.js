import { getData } from './ajax.js';

(function() {
    document.addEventListener('DOMContentLoaded', init);
})();

async function init() {
    console.log('Page loaded and self-invoking function executed.');

    const racesData = await getApiData();

    addDatatoDocument(racesData);
};

const addDatatoDocument = (data) => {
    const racesHolder = document.getElementById('allRaces');

    data.reverse();

    for (const race of data) {
        const raceElement = document.createElement('p');
        raceElement.textContent = race.meeting_official_name;
        racesHolder.appendChild(raceElement);
    }
};

const getApiData = async () => {
    const data = await getData('https://api.openf1.org/v1/meetings');

    return data;
};