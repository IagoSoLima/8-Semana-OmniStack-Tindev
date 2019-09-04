import mongoose from 'mongoose';

class Database {
  constructor() {
    this.init();
  }
  init() {
    mongoose.connect('mongodb://localhost:27017/tindev', {
      useNewUrlParser: true,
    });
  }
}

export default new Database();
