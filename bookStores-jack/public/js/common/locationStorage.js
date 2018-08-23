define(function() {
  var storage = window.localStorage
  var localStorage = {
    get: function(key) {
      var val = storage.getItem(key)
      return JSON.parse(val)
    },
    set: function(key, val) {
      if (!val) {
        this.remove(key)
      } else {
        storage.setItem(key, JSON.stringify(val))
      }
    },
    remove: function(key) {
      storage.removeItem(key)
    },
    clear: function() {
      storage.clear()
    }
  }
  return localStorage
})
