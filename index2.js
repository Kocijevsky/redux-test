"use strict";
var expect = require('expect.js');
var deepFreeze = require('deep-freeze');

const todos = (state = [], action) => {

};

const testAddTodo = () => {
    const stateBefore = []

    const todoAfter = {
        id: 0,
        text: 'Lern Redux',
        completed: true
    };

    deepFreeze(todoBefore);

    expect(
        toggleTodo(todoBefore)
    ).to.eql(todoAfter)
};
testTodo();


console.log('All tests are passed');