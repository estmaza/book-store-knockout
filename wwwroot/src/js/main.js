'use strict'

requirejs.config({
  baseUrl: 'src',
  paths: {
    app: 'js/app',
    authorViewModel: 'js/author-view-model',
    bookViewModel: 'js/book-view-model',
    storeViewModel: 'js/store-view-model',
    storage: 'js/storage',
    bootstrap: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min',
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
    knockout: 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min',
    komapping: 'https://cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping.min',
    multiselect: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.1/js/bootstrap-select',
    datepicker: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.min',
    knockoutChangeTracker: 'js/knockout-change-tracker',
    service: 'js/service'
  },
  shim: {
    komapping: {
      deps: ['knockout']
    },
    multiselect: {
      deps: ['jquery', 'bootstrap']
    },
    storeViewModel: {
      deps: ['komapping']
    },
    knockoutChangeTracker: {
      deps: ['komapping']
    },
    bootstrap: {
      deps: ['jquery']
    },
    service: {
      deps: ['storage']
    },
    app: {
      deps: ['service', 'knockoutChangeTracker']
    }
  }
});

require(['jquery', 'knockout', 'komapping'], function ($, ko, komapping) {
  window.ko = ko;
  window.ko.mapping = komapping;

  require(['knockoutChangeTracker', 'multiselect', 'datepicker', 'service', 'app', 'storage', 'authorViewModel', 'bookViewModel', 'storeViewModel'], function () {
    app.start('body');
  });
});
