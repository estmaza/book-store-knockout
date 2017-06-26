class authorViewModel {
    constructor(data) {
        const authorMapping = {
            'copy': ['id']
        };

        ko.mapping.fromJS(data, authorMapping, this);

        this.fullName = ko.computed(() => `${this.firstName()} ${this.lastName()}`);
    }   
}

// ; var authorViewModel = function (data) {
//     var self = this;

//     var authorMapping = {
//         'copy': ['id']
//     };

//     ko.mapping.fromJS(data, authorMapping, self);

//     self.fullName = ko.computed(function () {
//         return self.firstName() + ' ' + self.lastName();
//     });

//     return self;
// };