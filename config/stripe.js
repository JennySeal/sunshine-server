const configureStripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.NODE_ENV === 'production'
    ? 'pk_live_51JCKsaGHGV93t4GrOMLdVaKGGxku5AW8V70IEdqj479IsVCJu95TLfY9vZzU5VHFqvAhsq3uZ4Ul6pduRcxODGuF00FI3Nh0MG'
    : 'sk_test_51JCKsaGHGV93t4Gr7roeQW9u59jlWxyc288WB1hHhZqqBUA1pIbkkBJw5DMjTJQ0bOtt34jT99kcLAj7fTHiqcq300LbUewW1N';

const stripe = configureStripe(STRIPE_SECRET_KEY);

module.exports = stripe;