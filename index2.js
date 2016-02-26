"use strict";
const expect = require('expect.js');
const deepFreeze = require('deep-freeze');
const React = require('react');
const ReactDom = require('react-dom');
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
            console.log(action);
            console.log(!state.completed);
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
        case 'TOGGLE_TODO':
            return state.map(t=>todo(t, action));
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

const FilterLink = ({filter,currentFilter, children})=> {
    if(currentFilter===filter){
        return <span>{children}</span>
    }
    return <a href="#"
              onClick={ e=>
                  {
                    e.preventDefault();
                    store.dispatch({
                        type:'SET_VISIBILITY_FILTER',
                        filter
                    });
                  }
              }>
        {children}
    </a>
};

const getVisibleTodos = (todos, filter)=> {
    switch (filter) {
        case "SHOW_ALL":
            return todos;
        case "SHOW_ACTIVE":
            return todos.filter(todo=> {
                return !todo.completed
            });
        case "SHOW_COMPLETED":
            return todos.filter(todo=> {
                return todo.completed
            });
    }
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

const {createStore} = Redux;
const store = createStore(todoApp);

const {Component} = React;

let nextId = 0;

class TodoApp extends Component {
    render() {
        const{todos,visibilityFilter} = this.props;
        const visibleTodos = getVisibleTodos(
            todos,
            visibilityFilter
        );
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button onClick={()=>{
                    store.dispatch({
                        type:'ADD_TODO',
                        text:this.input.value,
                        id:nextId++
                    });
                    this.input.value='';
                }}>
                    AddToDo
                </button>
                <ul>
                    {visibleTodos.map(todo=>
                        <li
                            onClick={ ()=>{
                                 store.dispatch({
                                    type:'TOGGLE_TODO',
                                    id:todo.id
                                })
                            }}
                            style={{textDecoration:
                                todo.completed
                                    ?'line-through'
                                    :'none'
                                }}
                            key={todo.id}>
                            {todo.text}
                        </li>
                    )}
                </ul>
                <p>
                    Show:
                    {' '}
                    <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>
                        All
                    </FilterLink>
                    {' '}
                    <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>
                        Active
                    </FilterLink>
                    {' '}
                    <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>
                        Complated
                    </FilterLink>
                </p>
            </div>
        )
    }
}


const render = ()=> {
    ReactDom.render(
        <TodoApp {...store.getState()}/>,
        document.getElementById('root')
    );
};

store.subscribe(render);

render();

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