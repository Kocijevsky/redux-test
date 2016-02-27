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


const {Component} = React;
const {createStore} = Redux;

let nextId = 0;

const AddTodo = (props, {store})=> {
    let input;
    return (
        <div>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <button
                onClick={()=>{
                    if(input.value!==''){
                        store.dispatch({
                                type:'ADD_TODO',
                                text:input.value,
                                id:nextId++
                            });
                            input.value='';
                        }
                    }
                }
            >
                AddToDo
            </button>
        </div>
    )
};

AddTodo.contextTypes = {
    store: React.PropTypes.object
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

const Link = ({
    active,
    children,
    onClick
    })=> {
    if (active) {
        return <span>{children}</span>
    }
    return <a href="#"
              onClick={ e=>
                  {
                    e.preventDefault();
                    onClick();
                  }
              }>
        {children}
    </a>
};

class FilterLink extends Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() =>
            this.forceUpdate()
        )
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const {store} = this.context;
        const state = store.getState();

        return (
            <Link
                active={
                    props.filter === state.visibilityFilter
                }
                onClick={ ()=>{
                        store.dispatch({
                            type:'SET_VISIBILITY_FILTER',
                            filter:props.filter
                        })
                    }
                }
            >
                {props.children}
            </Link>
        )
    }
}

FilterLink.contextTypes = {
    store: React.PropTypes.object
};

const Footer = () => (
    <p>
        Show:
        {' '}
        <FilterLink
            filter="SHOW_ALL"
        >
            All
        </FilterLink>
        {' '}
        <FilterLink
            filter="SHOW_ACTIVE"
        >
            Active
        </FilterLink>
        {' '}
        <FilterLink
            filter="SHOW_COMPLETED"
        >
            Completed
        </FilterLink>
    </p>
);

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

class VisibleTodoList extends Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() =>
            this.forceUpdate()
        )
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const {store} = this.context;
        const state = store.getState();

        return (
            <TodoList
                todos={
                    getVisibleTodos(state.todos,state.visibilityFilter)
                }
                onTodoClick={id => {
                    store.dispatch({
                        type:'TOGGLE_TODO',
                        id
                    })
                }}
            />
        )
    }
}

VisibleTodoList.contextTypes = {
    store: React.PropTypes.object
};

const TodoApp = () =>
    (
        <div>
            <AddTodo/>
            <VisibleTodoList/>
            <Footer/>
        </div>
    );

class Provider extends Component {
    getChildContext() {
        return {
            store: this.props.store
        }
    }

    render() {
        return this.props.children;
    }
}

Provider.childContextTypes = {
    store: React.PropTypes.object
};

ReactDom.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>
    ,
    document.getElementById('root')
);

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