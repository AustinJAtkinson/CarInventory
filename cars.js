"use strict"

class Car {
    constructor(model, color, year, inventoryId) {
        this.model = model;
        this.color = color;
        this.year = year;
        this.inventoryId = inventoryId;
    }
}

class Brand {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.cars = []
    }
    addCar(car) {
        this.cars.push(car);
    }
    removeCar(car) {
        const index = this.getCarIndex(car);
        this.cars.splice(index, 1);
    }
    updateCar(oldCarInfo, newCarInfo) {
        const index = this.getCarIndex(oldCarInfo);
        this.cars.splice(index, 1, newCarInfo)
    }
    getCarIndex(car) {
        return this.cars.indexOf(car);
    }
}

let id = 0
const brands = [];

onclick('new-brand', () => {
    const elementId = 'new-car-brand'
    const newCarBrand = getValue(elementId);
    if (newCarBrand === '') {
        alert('Brand name is blank')
        return;

    }
    brands.push(new Brand(id++, newCarBrand))
    document.getElementById(elementId).value = ''
    drawDOM();
});

function onclick(id, action) {
    const element = document.getElementById(id);
    element.addEventListener('click', action);
    return element;
};

function getValue(id) {
    return document.getElementById(id).value;
};

function drawDOM() {
    let inventoryDiv = document.getElementById('inventory');
    clearElement(inventoryDiv);
    for (const brand of brands) {
        let table = createBrandTable(brand);
        let title = document.createElement('h2');
        title.innerHTML = brand.name;
        title.appendChild(deleteBrandButton(brand));
        inventoryDiv.appendChild(title);
        inventoryDiv.appendChild(table);
        for (const car of brand.cars) {
            createCarRow(brand, table, car);
        }
    }
};

function deleteBrandButton(brand) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Delete Brand';
    btn.onclick = () => {
        const index = brands.indexOf(brand);
        brands.splice(index, 1);
        drawDOM();
    }
    return btn;
};

function createCarRow(brand, table, car) {
    let row = table.insertRow(brand.getCarIndex(car) + 2);
    const carIndex = brand.getCarIndex(car)
    row.appendChild(createRowInputChild('year', `${brand.id}-${carIndex}`, 'td', car.year));
    row.appendChild(createRowInputChild('model', `${brand.id}-${carIndex}`, 'td', car.model))
    row.appendChild(createRowInputChild('color', `${brand.id}-${carIndex}`, 'td', car.color))
    row.appendChild(createRowInputChild('inventoryId', `${brand.id}-${carIndex}`, 'td', car.inventoryId))

    let actionBtns = row.insertCell(4);
    actionBtns.appendChild(createUpdateButton(brand, car));
    actionBtns.appendChild(createDeleteRowButton(brand, car));
    actionBtns.appendChild(createSaveButton(brand, car));
    actionBtns.appendChild(createCancelButton(brand, car));
};

function createUpdateButton(brand, car) {
    let btn = document.createElement('button');
    const carIndex = brand.getCarIndex(car)
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Update';
    btn.setAttribute('id', `update-${brand.id}-${carIndex}`)

    btn.onclick = () => {
        document.getElementById(`update-${brand.id}-${carIndex}`).hidden = true;
        document.getElementById(`delete-${brand.id}-${carIndex}`).hidden = true;
        document.getElementById(`save-${brand.id}-${carIndex}`).hidden = false;
        document.getElementById(`cancel-${brand.id}-${carIndex}`).hidden = false;

        document.getElementById(`year-input-${brand.id}-${carIndex}`).disabled = false;
        document.getElementById(`model-input-${brand.id}-${carIndex}`).disabled = false;
        document.getElementById(`color-input-${brand.id}-${carIndex}`).disabled = false;
        document.getElementById(`inventoryId-input-${brand.id}-${carIndex}`).disabled = false;

    };
    return btn;
};

function createSaveButton(brand, car) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Save';
    btn.setAttribute('id', `save-${brand.id}-${brand.getCarIndex(car)}`)
    btn.hidden = true;
    btn.onclick = () => {
        const carIndex = brand.getCarIndex(car);
        const model = getValue(`model-input-${brand.id}-${carIndex}`);
        const color = getValue(`color-input-${brand.id}-${carIndex}`);
        const year = getValue(`year-input-${brand.id}-${carIndex}`);
        const inventoryId = getValue(`inventoryId-input-${brand.id}-${carIndex}`);

        const updatedCar = new Car(model, color, year, inventoryId)
        const validationErrors = validateCarInfo(updatedCar)

        if (validationErrors.length !== 0) {
            let error = 'is blank';
            for (const invalidProperty of validationErrors) {
                error = `${invalidProperty} ${error}`
            }
            alert(error);
            return '';
        }

        brand.updateCar(car, updatedCar)
        drawDOM();
    };
    return btn;
};

function createCancelButton(brand, car) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Cancel';
    btn.hidden = true;
    btn.setAttribute('id', `cancel-${brand.id}-${brand.getCarIndex(car)}`)
    btn.onclick = () => {
        drawDOM();
    };
    return btn;
};

function createDeleteRowButton(brand, car) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Delete';
    btn.setAttribute('id', `delete-${brand.id}-${brand.getCarIndex(car)}`)
    btn.onclick = () => {
        brand.removeCar(car)
        drawDOM();
    };
    return btn;
};

function createBrandTable(brand) {
    let table = document.createElement('table');
    table.setAttribute('class', 'table table-dark table-striped');
    let row = table.insertRow(0);

    row.appendChild(createRowChild('Year'));
    row.appendChild(createRowChild('Model'));
    row.appendChild(createRowChild('Color'));
    row.appendChild(createRowChild('Inventory Id'));
    row.appendChild(createRowChild('Action(s)'));

    let formRow = table.insertRow(1);
    formRow.appendChild(createRowInputChild('year', brand.id, 'th'));
    formRow.appendChild(createRowInputChild('model', brand.id, 'th'));
    formRow.appendChild(createRowInputChild('color', brand.id, 'th'));
    formRow.appendChild(createRowInputChild('inventoryId', brand.id, 'th'));

    let addCar = document.createElement('th');
    let newCarButon = creatNewCarButon(brand);
    addCar.appendChild(newCarButon);

    formRow.appendChild(addCar);

    return table;
};

function creatNewCarButon(brand) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Add Car';
    btn.onclick = () => {
        const newCar = getNewCar(brand);
        if (newCar !== '') {
            brand.addCar(newCar)
            drawDOM();
        }
    }
    return btn;
};

function validateCarInfo(car) {
    const ret = [];
    if (car.year === '') {
        ret.push('Year');
    }
    if (car.model === '') {
        ret.push('Model');
    }
    if (car.color === '') {
        ret.push('Color');
    }
    if (car.inventoryId === '') {
        ret.push('Inventory Id');
    }
    return ret;
};

function getNewCar(brand) {
    const model = getValue(`model-input-${brand.id}`)
    const year = getValue(`year-input-${brand.id}`)
    const inventoryId = getValue(`inventoryId-input-${brand.id}`)
    const color = getValue(`color-input-${brand.id}`)

    const car = new Car(model, color, year, inventoryId);

    const validationErrors = validateCarInfo(car)

    if (validationErrors.length !== 0) {
        let error = 'is blank';
        for (const invalidProperty of validationErrors) {
            error = `${invalidProperty} ${error}`
        }
        alert(error);
        return '';
    }

    return car;
};

function createRowInputChild(columnName, id, element, value = '') {
    let column = document.createElement(element);
    let input = document.createElement('input')
    input.setAttribute('id', `${columnName}-input-${id}`)
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'form-control');
    if (value !== '') {
        input.disabled = true;
        input.value = value;
    }
    column.appendChild(input)

    return column
};

function createRowChild(columnName) {
    let column = document.createElement('th');
    column.innerHTML = columnName;
    return column
};

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};