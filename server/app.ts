import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

import config from './config/db';
import setRoutes from './routes';

const app = express();
app.set('port', 3000);

app.use('/', express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(config.testUrl);
} else {
  mongoose.connect(config.url);
}

const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  if (!module.parent) {
    app.listen(app.get('port'), () => {
      console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
    });
  }

});

export { app };
