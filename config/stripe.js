const configureStripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.NODE_ENV === 'production'
    ? 'sk_live_MY_SECRET_KEY'
    : 'sk_test_51JCKsaGHGV93t4Gr7roeQW9u59jlWxyc288WB1hHhZqqBUA1pIbkkBJw5DMjTJQ0bOtt34jT99kcLAj7fTHiqcq300LbUewW1N';

const stripe = configureStripe(STRIPE_SECRET_KEY);

module.exports = stripe;