const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://marinaracewear.com/storage/media/attributes/8/9/5/9/7/89597/2.jpg"
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://zapatosxmayor.com/wp-content/uploads/2020/11/zapato-casual-hombre-zapatos-negros.jpg"
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image: "https://neweraec.vtexassets.com/arquivos/ids/156733/10047531_1.jpg?v=638324710543770000"
  }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const cart = [];
let ppButton = null;

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });

  const cartTotal = document.getElementById('cart-total');
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }

  if (cart.length === 0) {
    const ppButtonContainer = document.getElementById('pp-button');
    if (ppButtonContainer) {
      ppButtonContainer.innerHTML = '';
      ppButtonContainer.style.display = 'none';
    }
    const payButton = document.getElementById('pay-button');
    if (payButton) payButton.style.display = 'inline-block';
  }
}

products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button>Añadir al carrito</button>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    cart.push(product);
    updateCart();
  });

  container.appendChild(card);
});

function initPaymentBox(total) {
  const amountInCents = Math.round(total * 100);
  const transactionId = `TRX_${Date.now()}`;
  localStorage.setItem('lastTransactionAmount', total.toFixed(2));
  localStorage.setItem('lastTransactionId', transactionId);

  const ppButtonContainer = document.getElementById('pp-button');
  ppButtonContainer.innerHTML = '';

  if (window.PPaymentButtonBox) {
    ppButton = new window.PPaymentButtonBox({
      token: 'xNXhqbR6XsDOcKaXVeTAyW1Yd_C6cF92kQKVL_LBJy4CFm3cE-u1Ew67rZ2z2urVoCDDmZKzfrO2BfEx2JI4cToMqTbQj3BNmlhzhpaZx9k9rFVRysjIrC8BeJDba-fi3AuAh-Adx0Rh2KPMC_J4-OebBzIAHqw1gbqG9dPOu-59NfE2vSqpvXnfENrAPOI-2rhAch8nSoBEcucccHpYyjCaTo9ZeJKFDcTsdo-KkqFbhmI4h-N4XVtdOJLPHdBll0H5eSq9AJRnAw2AvYkHOb9DOnuLQ7gBmujgYLTkPRgY4mUvdyxc6q3ZEubuLNA_FicDfiS639CGUrE8l8FA8V72T8s',
      clientTransactionId: transactionId,
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: "USD",
      storeId: "1d7b7cb8-6c43-48b2-b5ed-cb4fffab8cfe",
      reference: `Compra en tienda - ${transactionId}`,
      lang: "es",
      defaultMethod: "card",
      timeZone: -5,
      redirect: false,

      onSuccessfulPayment: function (response) {
        console.log("Pago exitoso, respuesta:", response);
        const clientTransactionId = transactionId;
        const transactionIdFromResponse = response.transactionId || 'sin-id';
        const transactionStatus = 'Approved';

        // Guardar info en localStorage si lo deseas
        localStorage.setItem('paymentStatus', transactionStatus);
        localStorage.setItem('transactionId', transactionIdFromResponse);

        // Redirigir a página de confirmación
        window.location.href = `confirmacion.html?clientTransactionId=${clientTransactionId}&transactionId=${transactionIdFromResponse}&transactionStatus=${transactionStatus}`;
      },

      onCancelledPayment: function () {
        showPaymentMessage('Pago cancelado', 'info');
        document.getElementById('pay-button').style.display = 'inline-block';
        document.getElementById('pp-button').style.display = 'none';
      },

      onFailurePayment: function (error) {
        showPaymentMessage('Error en el pago: ' + error.message, 'error');
        document.getElementById('pay-button').style.display = 'inline-block';
        document.getElementById('pp-button').style.display = 'none';
      }
    });

    ppButton.render("pp-button");
    document.getElementById('pp-button').style.display = 'block';
  } else {
    console.error("La librería PayPhone no está disponible");
    showPaymentMessage("Error al cargar el botón de pago. Intente más tarde.", "error");
    document.getElementById('pay-button').style.display = 'inline-block';
  }
}

function showPaymentMessage(message, type) {
  const paymentResponse = document.getElementById('payment-response');
  if (paymentResponse) {
    paymentResponse.textContent = message;
    paymentResponse.style.display = 'block';
    paymentResponse.className = `payment-response ${type}`;
    setTimeout(() => {
      paymentResponse.style.display = 'none';
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const payButton = document.getElementById('pay-button');
  payButton.addEventListener('click', function () {
    if (cart.length === 0) {
      showPaymentMessage("El carrito está vacío. Agrega productos antes de pagar.", "info");
      return;
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    payButton.style.display = 'none';
    initPaymentBox(total);
  });

  setTimeout(() => {
    if (!window.PPaymentButtonBox) {
      console.error('No se pudo cargar la librería de PayPhone');
    } else {
      console.log('PayPhone cargado correctamente');
    }
  }, 1000);
});
