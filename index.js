'use strict';
const Redux = require('redux');
const React = require('react');
const ReactDom = require('react-dom');

const counter = (state = 0, action)=> {
    console.log('--------------');
    console.log(action);
    console.log(state);
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
            break;
        case 'DECREMENT':
            return state - 1;
            break;
        default:
            return state;
            break
    }

};

const Counter = ({ value, onIncrement, onDecrement }) => (
    <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
    </div>
);

//var createStore = Redux.createStore;
const {createStore} = Redux;
const store = createStore(counter);

const render = ()=> {
    ReactDom.render(
        <Counter
            value={store.getState()}
            onIncrement={()=>
                store.dispatch({
                    type:'INCREMENT'
                })
            }
            onDecrement={()=>
                store.dispatch({
                    type:'DECREMENT'
                })
            }
        />,
        document.getElementById('root')
    );
};

store.subscribe(render);

render();