; var bookViewModel = function (data) {
  var self = this;

  if (data === undefined) {
    data = {
      id: 0,
      name: '',
      authors: [],
      publishDate: '01/01/1900',
      rating: 1,
      pages: 0
    };
  }

  var bookMapping = {
    'copy': ['id']
  };

  ko.mapping.fromJS(data, bookMapping, self);
  
  return self;
};