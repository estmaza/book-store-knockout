; var storeViewModel = function (data) {
    var self = this;

    var storeMapping = {
        'title': {
            'create': function (options) {
                return ko.observable(options.data.toUpperCase());
            }
        },
        'authors': {
            'create': function (options) {
                return new authorViewModel(options.data);
            }
        },
        'books': {
            'create': function (options) {
                return new bookViewModel(options.data);
            }
        }
    };

    ko.mapping.fromJS(data, storeMapping, self);

    return self;
};
