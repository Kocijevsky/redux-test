"use strict";
var expect = require('expect.js');
var deepFreeze = require('deep-freeze');

const Redux = require('redux');


const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
            break;
        case 'TOGGLE_TODO':
            if (action.id != state.id) {
                return state
            }
            return Object.assign({}, state, {completed: !state.completed});
        default:
            return state
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
            break;
        case 'TOGGLE_TODO':
            return state.map(t=>todo(t, action));
            break;
        default:
            return state;
            break
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
            break;
        default:
            return state;
            break
    }
};


const {combineReducers}= Redux;

const todoApp = combineReducers({
    todos,
    visibilityFilter
});


const {createStore} = Redux;
const store = createStore(todoApp);


console.log('Initial state:');
console.log(store.getState());
console.log('---------------');

console.log('Dispatching ADD_TODO');
store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Lern Redux'
});
console.log('---------------');

console.log('Current state:');
console.log(store.getState());
console.log('---------------');

store.dispatch({
    id: 0,
    text: 'Lern Redux',
    type: 'ADD_TODO'
});
console.log('Current state:');
console.log(store.getState());
console.log('---------------');

store.dispatch({
    id: 1,
    type: 'TOGGLE_TODO'
});
console.log('Current state:');
console.log(store.getState());
console.log('---------------');


store.dispatch({
    filter: 'SHOW_COMPLETE',
    type: 'SET_VISIBILITY_FILTER'
});
console.log('Current state:');
console.log(store.getState());
console.log('---------------');


const testAddTodo = () => {
    const stateBefore = [];

    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Lern Redux'
    };

    const stateAfter = [{
        id: 0,
        text: 'Lern Redux',
        completed: false
    }];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).to.eql(stateAfter)
};

const testToggleTodo = ()=> {
    const stateBefore = [{
        id: 0,
        text: 'Lern Redux',
        completed: false
    }, {
        id: 1,
        text: 'Go Shopping',
        completed: false
    }];

    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };

    const stateAfter = [{
        id: 0,
        text: 'Lern Redux',
        completed: false
    }, {
        id: 1,
        text: 'Go Shopping',
        completed: true
    }];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).to.eql(stateAfter)
};

testAddTodo();
testToggleTodo();

console.log('All tests are passed');