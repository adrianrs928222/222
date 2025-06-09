// server.js
const express = require('express');
const stripe = require('stripe')('TU_CLAVE_SECRETA_DE_STRIPE'); // <-- Sustituye esto

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (como index.html y almohada.jpg)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/crear-sesion-checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ['ES', 'PT'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Envío estándar (48–72 h)',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 650, // 6,50 € en céntimos
              currency: 'eur',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
      ],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Almohada Ortopédica Cervical',
              images: ['https://tusitio.com/almohada.jpg'], // o puedes dejarlo vacío
            },
            unit_amount: 3499, // 34,99 € en céntimos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://tusitio.com/gracias',
      cancel_url: 'https://tusitio.com/cancelado',
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error('Error al crear la sesión de Stripe:', err.message);
    res.status(500).send('Error en el servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
