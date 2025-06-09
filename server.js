const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');

const stripe = Stripe('sk_live_TU_CLAVE_SECRETA'); // Cambia por tu clave secreta

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/crear-sesion-checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Almohada Ortopédica Cervical',
            },
            unit_amount: 3999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://tusitio.com/gracias',
      cancel_url: 'https://tusitio.com/cancelado',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la sesión' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
