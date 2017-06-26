; var app = app || {};

(function (containerId, dataUrl) {
  var self = this;

  //TODO all private
  self.service = new Service();
  self.changeTracker = new knockoutChangeTracker(self.changeTracker);
  self.viewModel = new storeViewModel(self.service.get());

  self.start = function () {
    self.changeTracker.applyArrayChangeTracking(self.viewModel.books());
    ko.applyBindings(self.viewModel, $(containerId)[0]);
    initPlugins();
  };

  self.viewModel.add = function () {
    let book = new bookViewModel();
    self.changeTracker.applyChangeTracking(book);
    self.viewModel.books.push(book);
    initPlugins();
  };

  self.viewModel.save = function (data) {
    let index = self.viewModel.books.indexOf(data);
    let obj = ko.mapping.toJS(data);

    if (data.id > 0) {
      let model = new bookViewModel(obj);
      self.changeTracker.applyChangeTracking(model);
      self.viewModel.books.splice(index, 1, model);
      self.service.save(obj);
    } else {
      let id = self.service.save(obj);
      obj.id = id;
      let model = new bookViewModel(obj);
      self.changeTracker.applyChangeTracking(model);
      self.viewModel.books.splice(index, 1, model);
    }

    initPlugins();
  };

  self.viewModel.remove = function (data) {
    self.viewModel.books.remove(function (book) {
      return book.id === data.id;
    });

    self.service.delete(data.id);
  };

  let initPlugins = function () {
    $('.selectpicker').selectpicker();
    $('.datepicker').datepicker();
  };

}).apply(app);
