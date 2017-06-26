class Service {
  constructor() {
    this.storage = new Storage();
  }

  get() {
    var responce = JSON.parse(this.storage.get());
    if (responce.success) {
      return responce.data;
    }
  }

  save(book) {
    return this.storage.save(book);
  }

  delete(id) {
    this.storage.delete(id);
  }
}

// ; var Service = function () {
//   var self = this;

//   var storage = new Storage();

//   self.get = function () {
//     var responce = JSON.parse(storage.get());
//     if (responce.success){
//       return responce.data;
//     }
//   };

//   self.save = function (book) {
//     return storage.save(book);
//   };

//   self.delete = function (id) {
//     storage.delete(id);
//   };

//   return self;
// };