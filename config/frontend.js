const FrontEnd_Dev_Url = ['http://localhost:3000']

const FrontEnd_Production_Url = ['https://sunshine-store.netlify.app', 'https://www.sunshine-store.netlify.app'];

module.exports = process.env.NODE_ENV === 'production' ? FrontEnd_Production_Url : FrontEnd_Dev_Url;
