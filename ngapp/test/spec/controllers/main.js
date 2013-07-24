'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('notesApp'));

  var MainCtrl, scope;

  var mockNote = {
    'query'  : function() { return [{id: 1}, {id: 2}]; },
    'save'   : function(params, callback) { return callback(params); },
    'delete' : function(params, callback) { return callback(params); }
  };


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      Note : mockNote
    });
  }));

  it('initializes the notes with a query to the server', function () {
    expect(scope.notes).toEqual([{id: 1}, {id: 2}]);
  });

  it('is able to create notes', function () {
    scope.create('title', 'body');
    expect(scope.notes[scope.notes.length - 1]).toEqual({'title' : 'title', 'body' : 'body' });
  });

  it('is able to delete notes', function () {
    scope.delete(0);
    expect(scope.notes[0]).toEqual({id: 2});
  });
});
