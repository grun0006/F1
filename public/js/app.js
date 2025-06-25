import { getData } from './ajax.js';

let currentIndex = 11800;
const colors = ['blue', 'red', 'green', 'yellow', 'black', 'cyan', 'darkorange', 'deepskyblue', 'gold', 'indigo', 'lightseagreen', 'magenta', 'orangered', 'palegreen', 'pink', 'saddlebrown', 'sandybrown', 'springgreen', 'turquoise'];
let colorIndex = 0;
let driverName = '';

(function() {
    document.addEventListener('DOMContentLoaded', init);
})();

async function init() {
    console.log('Page loaded and self-invoking function executed.');

    document.getElementById('loader').style.display = 'flex';

    const [locationData, leaderbordData, drivers] = await Promise.all([
        getApiData(),
        getLeaderbordData(),
        getDriverData(),
    ]);

    document.getElementById('loader').style.display = 'none';

    console.log(locationData);

    setInterval(() => {
        const raceTrack = document.getElementById('race-Track');
        raceTrack.innerHTML = '';

        for (let locationDriver of locationData) {
            addDatatoDocument(locationDriver[currentIndex], (colorIndex), drivers);
            addLeaderbordDatatoDocument(leaderbordData, locationData, drivers);
            if (colorIndex == locationData.length - 1) {
                colorIndex = 0;
            } else {
                colorIndex++;
            }
        }
        currentIndex++;
    }, 100);
};

const addDatatoDocument = (data, colorNumber, drivers) => {
    const raceTrack = document.getElementById('race-Track');
    const locationElement = document.createElement('div');
    const nameElement = document.createElement('h1');

    for (const driver of drivers) {
        if (driver.driver_number == data.driver_number) {
            driverName = driver.name_acronym;
        }
    }

    locationElement.setAttribute('name', data.driver_number);
    nameElement.innerText = driverName;
    locationElement.style.width = '10px';
    locationElement.style.height = '10px';
    locationElement.style.position = 'absolute';
    locationElement.style.left = ((data.x / 13) + 1000) + 'px';
    locationElement.style.top = ((data.y / 13) + 600) + 'px';
    locationElement.style.backgroundColor = colors[colorNumber];

    locationElement.appendChild(nameElement);
    raceTrack.appendChild(locationElement);
};

const addLeaderbordDatatoDocument = (positionData, locationDataArray, drivers) => {
    const leaderbordHolder = document.getElementById('leaderbord-holder');
    leaderbordHolder.innerHTML = '';

    const leaderboardEntries = []

    for (let i = 0; i < locationDataArray.length; i++) {
        const locationHistory = locationDataArray[i];
        const latestLocation = locationHistory[currentIndex];

        if (!latestLocation) continue;

        const driverNumber = latestLocation.driver_number;
        const closestPosition = findClosestPositionEntry(positionData, latestLocation.date, driverNumber);

        if (closestPosition) {
            for (const driver of drivers) {
                if (driver.driver_number == driverNumber) {
                    driverName = driver.full_name;
                }
            }

            const leaderbordElement = document.createElement('p');
            leaderbordElement.setAttribute('name', closestPosition.position);
            leaderbordElement.textContent = `Position: ${closestPosition.position} Driver: ${driverName}`;
            leaderboardEntries.push(leaderbordElement);
        }
    }

    leaderboardEntries.sort((a, b) => {
        const numA = parseInt(a.getAttribute("name").match(/\d+/)[0]);
        const numB = parseInt(b.getAttribute("name").match(/\d+/)[0]);
        return numA - numB;
    });

    leaderboardEntries.forEach(entry => leaderbordHolder.appendChild(entry));
};

function findClosestPositionEntry(positionData, targetDateStr, driverNumber) {
    const targetDate = new Date(targetDateStr);
    let closest = null;
    let minDiff = Infinity;

    for (let entry of positionData) {
        if (entry.driver_number !== driverNumber) continue;

        const entryDate = new Date(entry.date);
        const diff = Math.abs(entryDate - targetDate);

        if (diff < minDiff) {
            minDiff = diff;
            closest = entry;
        }
    }

    return closest;
}

const getApiData = async () => {
    const drivers = await getData('https://api.openf1.org/v1/drivers?session_key=latest');

    const promises = drivers.map(driver => 
        getData('http://localhost:3001/api/locations/' + driver.driver_number)
    );

    const dataArray = await Promise.all(promises);

    return dataArray;
};

const getDriverData = async() => {
    const drivers = await getData('https://api.openf1.org/v1/drivers?session_key=latest');

    return drivers;
};

const getLeaderbordData = async () => {
    const leaderbordData = await getData('https://api.openf1.org/v1/position?session_key=latest');

    return leaderbordData;
};