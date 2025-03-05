# Wilks calculator Admin app

App created with React and expressJs.
App for calculating Wilks score.


## Installation

Clone the repo.

```bash
git clone https://github.com/m2ichu/wilksCalculatorApp.git
```

Go to main content

```bash
cd wilksCalculatorApp
```

Then open folder and create .env file.

```env
#for mongo db
MONGO_URI=< your mongo uri>

#for hash token
JWT_SECRET=< your seceret >

#port
PORT=5000ho
```

## For production 


```bash
npm run build
npm run start
```


## For developing

### &emsp;Backend
```bash
npm run install
npm run server
```

### &emsp;Frontend
```bash
cd frontend
npm run install
npm run dev
```


## License

[MIT](https://choosealicense.com/licenses/mit/)