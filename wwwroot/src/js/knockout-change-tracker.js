; var knockoutChangeTracker = function (parent) {
  var self = this;

  // Ensure this is in global scope
  ko.observableArray.fn.isObservableArray = true;

  var getObjProperties = function (obj) {
    var objProperties = [];
    var val = ko.utils.unwrapObservable(obj);

    if (val !== null && typeof val === 'object') {
      for (var i in val) {
        if (val.hasOwnProperty(i)) objProperties.push({ "name": i, "value": val[i] });
      }
    }

    return objProperties;
  };

  var traverseObservables = function (obj, action) {
    ko.utils.arrayForEach(getObjProperties(obj), function (observable) {
      if (observable && observable.value && !observable.value.nodeType && ko.isObservable(observable.value)) {
        action(observable);
      }
    });
  };

  ko.extenders.trackChange = function (target, track) {
    if (track) {
      target.hasValueChanged = ko.observable(false);
      target.hasDirtyProperties = ko.observable(false);

      target.isDirty = ko.computed(function () {
        return target.hasValueChanged() || target.hasDirtyProperties();
      });

      var unwrapped = target();
      if ((typeof unwrapped == "object") && (unwrapped !== null)) {
        traverseObservables(unwrapped, function (obj) {
          applyChangeTrackingToObservable(obj.value);

          obj.value.isDirty.subscribe(function (isdirty) {
            if (isdirty) target.hasDirtyProperties(true);
          });
        });
      }

      target.originalValue = target();
      target.subscribe(function (newValue) {
        // use != not !== so numbers will equate naturally
        target.hasValueChanged(newValue != target.originalValue);
        target.hasValueChanged.valueHasMutated();
      });

      if (!target.getChanges) {
        target.getChanges = function (newObject) {
          var obj = target();
          if ((typeof obj == "object") && (obj !== null)) {
            if (target.hasValueChanged()) {
              return ko.mapping.toJS(obj);
            }
            return getChangesFromModel(obj);
          }

          return target();
        };
      }
    }

    return target;
  };

  ko.extenders.trackArrayChange = function (target, track) {
    if (track) {
      target.isDirty = ko.observable(false);
      target.added = ko.observableArray([]);
      target.removed = ko.observableArray([]);

      var findItem = function (array, item) {
        return ko.utils.arrayFirst(array, function (o) {
          return o === item;
        });
      };

      var addItem = function (item) {
        var previouslyRemoved = findItem(target.removed(), item);
        if (previouslyRemoved) {
          target.removed.remove(previouslyRemoved);
        } else {
          target.added.push(item);
        }
        target.isDirty(target.added().length > 0 || target.removed().length > 0);
      };

      var removeItem = function (item) {
        var previouslyAdded = findItem(target.added(), item);
        if (previouslyAdded) {
          target.added.remove(previouslyAdded);
        } else {
          target.removed.push(item);
        }
        target.isDirty(target.added().length > 0 || target.removed().length > 0);
      };

      target.getChanges = function () {
        var result = {
          added: target.added(),
          removed: target.removed()
        };

        return result;
      };

      target.subscribe(function (changes) {
        ko.utils.arrayForEach(changes, function (change) {
          switch (change.status) {
            case "added":
              addItem(change.value);
              break;
            case "deleted":
              removeItem(change.value);
              break;
          }
        });
      }, null, "arrayChange");
    }
  };

  var applyChangeTrackingToObservable = function (observable) {
    // Only apply to basic writeable observables
    if (observable && !observable.nodeType && !observable.refresh && ko.isObservable(observable)) {
      if (observable.isObservableArray) {
        observable.extend({ trackArrayChange: true });
      }
      else {
        if (!observable.isDirty) observable.extend({ trackChange: true });
      }
    }
  };

  self.applyArrayChangeTracking = function (objects) {
    ko.utils.arrayForEach(objects, function (obj) {
      applyChangeTrackingToObservable(obj);
      var properties = getObjProperties(obj);
      ko.utils.arrayForEach(properties, function (property) {
        applyChangeTrackingToObservable(property.value);
      });
    });
  };

  self.applyChangeTracking = function (obj) {
    var properties = getObjProperties(obj);
    ko.utils.arrayForEach(properties, function (property) {
      applyChangeTrackingToObservable(property.value);
    });
  };

  self.getChangesFromModel = function (obj) {
    self.changes = null;
    var properties = getObjProperties(obj);

    ko.utils.arrayForEach(properties, function (property) {
      if (property.value !== null && typeof property.value.isDirty != "undefined" && property.value.isDirty()) {
        self.changes = self.changes || {};
        self.changes[property.name] = property.value.getChanges();
      }
    });
  };

  return self;
};
