const whitelist = [
  'http://localhost:3000',
  'http://localhost:5001',
  'http://localhost:5173',
  'https://ecommerce-clone-bl.vercel.app',
  'https://admin-ecommerce-clone-bl.vercel.app'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};

export default corsOptions;