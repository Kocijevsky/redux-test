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

const AddTodo = ({onAddClick})=> {
    let input;
    return (
        <div>
            <input ref={node => {
                    input = node;
                }}/>
            <button onClick={()=>{
                onAddClick(input.value);
                input.value='';
            }}>
                AddToDo
            </button>
        </div>
    )
};

const TodoItem = ({
    onClick,
    completed,
    text
    }) => {
    return (
        <li
            onClick={onClick}
            style={{textDecoration:
                completed
                    ?'line-through'
                    :'none'
                }}
        >
            {text}
        </li>
    )
};

const TodoList = ({
    todos,
    onTodoClick
    }) =>(
    <ul>
        {todos.map(t=>
            <TodoItem
                key={t.id}
                {...t}
                onClick={()=>{onTodoClick(t.id)}}
            />
        )}
    </ul>
);

const Footer = ({
    visibilityFilter,
    onFilterClick
    }) => (
    <p>
        Show:
        {' '}
        <FilterLink
            filter="SHOW_ALL"
            onClick={onFilterClick}
            currentFilter={visibilityFilter}
        >
            All
        </FilterLink>
        {' '}
        <FilterLink
            filter="SHOW_ACTIVE"
            onClick={onFilterClick}
            currentFilter={visibilityFilter}
        >
            Active
        </FilterLink>
        {' '}
        <FilterLink
            filter="SHOW_COMPLETED"
            onClick={onFilterClick}
            currentFilter={visibilityFilter}
        >
            Completed
        </FilterLink>
    </p>
);

const FilterLink = ({
    filter,
    currentFilter,
    children,
    onClick})=> {
    if (currentFilter === filter) {
        return <span>{children}</span>
    }
    return <a href="#"
              onClick={ e=>
                  {
                    e.preventDefault();
                    onClick(filter);
                  }
              }>
        {children}
    </a>
};


const TodoApp = ({todos,visibilityFilter}) =>
    (
        <div>
            <AddTodo
                onAddClick={(text)=>{
                        store.dispatch({
                            type:'ADD_TODO',
                            text:text,
                            id:nextId++
                        })
                    }}
            />
            <TodoList
                todos={getVisibleTodos(todos,visibilityFilter)}
                onTodoClick={id => {
                        store.dispatch({
                            type:'TOGGLE_TODO',
                            id:id
                        })
                    }}
            />
            <Footer
                visibilityFilter={visibilityFilter}
                onFilterClick={(filter)=>{
                         store.dispatch({
                            type:'SET_VISIBILITY_FILTER',
                            filter
                        });
                    }}
            />
        </div>
    );


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