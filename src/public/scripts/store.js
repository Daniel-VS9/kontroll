// ANCHOR Tabs store
const tabs = document.querySelectorAll('.tabs li');
const tabsContentBoxes = document.querySelectorAll('#tab-content > div');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach((item) => item.classList.remove('is-active'));
        tab.classList.add('is-active');

        const target = tab.dataset.target;
        tabsContentBoxes.forEach((box) => {
            if (box.getAttribute('id') === target) {
                box.classList.remove('is-hidden');
            } else {
                box.classList.add('is-hidden');
            }
        });
    });
});

// ANCHOR Shopping cart
let cart = [];
const iu = document.querySelector(
    '.navbar-item > .buttons > .close-session'
).id;

const addToCartBtns = document.querySelectorAll('.addbtn');
const cartTableItems = document.querySelector('.cart-table-items');
const saveOrder = document.getElementById('saveOrder');

const addItemToCart = (e) => {
    const button = e.target;

    const item = button.closest('.card');
    const itemId = item.querySelector('.addBtn').id;
    const itemTitle = item.querySelector('.card-product-name').textContent;
    const itemPrice = item
        .querySelector('.card-product-price')
        .textContent.substring(1);

    const newProduct = {
        id: itemId,
        title: itemTitle,
        price: itemPrice,
        quantity: 1,
    };

    toCart(newProduct);
};

function toCart(product) {
    const inputElement =
        cartTableItems.getElementsByClassName('cart-table-input');

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
            cart[i].quantity++;
            const inputValue = inputElement[i];
            inputValue.value++;
            totalAccount();
            return null;
        }
    }

    cart.push(product);
    renderCart();
}

function renderCart() {
    cartTableItems.innerHTML = '';

    cart.map((item) => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCartTable');

        const content = `
        <td class="cart-table-product" id='${item.id}'>
                        <h6>${item.title}</h6>
                    </td>
                    <td class="cart-table-price">
                        <p>$${item.price}</p>
                    </td>
                    <td class="cart-table-quantity">
                        <div class="columns is-mobile">
                            <div class="column">
                                <input class="input cart-table-input" type="number" min="1" value="${item.quantity}">
                            </div>
                            <div class="column">
                                <button class="button is-danger cart-table-deleteBtn">X</button>
                            </div>
                        </div>
                    </td>
        `;

        tr.innerHTML = content;
        cartTableItems.appendChild(tr);

        tr.querySelector('.cart-table-deleteBtn').addEventListener(
            'click',
            removeItem
        );
        tr.querySelector('.cart-table-input').addEventListener(
            'change',
            modifyQuantity
        );
    });
    totalAccount();
}

addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', addItemToCart);
});

function totalAccount() {
    let total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal');
    cart.forEach((e) => {
        total += Number(e.price) * Number(e.quantity);
    });
    itemCartTotal.innerHTML = `Total:  $${total}`;

    addToLocalStorage();
}

function removeItem(e) {
    const buttonDelete = e.target;
    const tr = buttonDelete.closest('.itemCartTable');
    const id = tr.querySelector('.cart-table-product').id;

    cart.forEach((element, i) => {
        if (element.id === id) {
            cart.splice(i, 1);
        }
    });

    tr.remove();
    totalAccount();
}

function modifyQuantity(e) {
    const input = e.target;
    const tr = input.closest('.itemCartTable');
    const id = tr.querySelector('.cart-table-product').id;

    cart.forEach((element, i) => {
        if (element.id === id) {
            input.value < 1
                ? (input.value = 1)
                : (cart[i].quantity = Number(input.value));
            totalAccount();
        }
    });
}

function addToLocalStorage() {
    localStorage.setItem(`${iu}cart`, JSON.stringify(cart));
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem(`${iu}cart`));

    if (storage) {
        cart = storage;
        renderCart();
    }
};

// ANCHOR
saveOrder.addEventListener('click', async () => {
    if (cart.length > 0) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/orders/addorder', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        await xhr.send(JSON.stringify({ cart }));
    }

    cart = [];
    renderCart();
});
