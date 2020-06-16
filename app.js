var ComponentB = {
    props: ['todos','todoItems'],
    data:function()
    {
        return {
            loadId: null,
            header:'',
        }
    },
    template: `<div class="todos">
                    <li class="list-group-item main-todo-list" >
                        <router-link :to="todos.id + '/todoitem'" :todo-items="todoItems">{{todos.todoTitle}}</router-link>
                        <button type="button" class="btn" @click="deleteTodo(todos.id)">
                            <i class="fa fa-trash"></i>
                        </button>
                    </li>
            </div>`,
    methods: {
        deleteTodo (id) {            
            axios
              .delete(`http://localhost:3000/todos/${id}`)
              .then(res => this.todos=res.data)
              .catch(err => console.error(err));
        },    
       
           
    }
}
    

    // ****COMPONENT A ****** 


var ComponentA = {
    data: function () {
        return {
            showAddNewTodo: false,
            newTodoTitle:'',

        }
    },
    props: ['headertitle', 'todos'],
    components: {
         'component-b' : ComponentB,
      },
    
    template:`<div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title main-title" >
                                {{headertitle}}<button type="button" class="btn mt-1" @click="toggleAdd" ><span class="fa fa-plus fa-xs"></span>
                                </button>
                            </div>       
                        <form v-show="showAddNewTodo">
                            <input type= "text" placeholder="Add new todo"  v-model="newTodoTitle">
                            <button type="submit" class="btn btn-success btn-sm" @click="addTodos(newTodoTitle)" >Add Todo</button>
                        </form>
                        <component-b v-for="todo in todos" :key="todo.id" :todos="todo"></component-b>
                    </div>
                </div>
            </div>
        </div>`,
    
    methods: {
        toggleAdd() {
            this.showAddNewTodo = !this.showAddNewTodo;
        },
        addTodos(newTodoTitle)
        {
            if (!newTodoTitle)
            {
                alert("Please Insert a Todo")
            }
            
            else {
                axios
                .post('http://localhost:3000/todos',{
                  todoTitle : newTodoTitle
              })
              .then(res => this.todos=res.data)
              .catch(err => console.error(err));
            }
            
            }
    },
  
}

    // ****COMPONENT D ****** 

var ComponentD = {
    props: ['todoItems'],
    template: `<div class="todoitems">
                <li class="list-group-item todo-items-list" :class="{'todo-complete':todoItems.completed}" >
                <input class="check" type="checkbox" :key="todoItems.id" @change="toggleCompleted">
                    <a href="#">{{todoItems.itemTitle}}</a>
                    </input>
                    <button type="button" class="btn" @click="deleteTodoItems(todoItems.id)">
                        <i class="fa fa-trash"></i>
                    </button>
                </li>
            </div>`,
    methods: {
        toggleCompleted()
        {
            this.todoItems.completed = !this.todoItems.completed;
        },
        deleteTodoItems(id)
        {
            axios
              .delete(`http://localhost:3000/todoItems/${id}`)
              .then(res => this.todoItems=res.data)
              .catch(err => console.error(err));
        }  
        
    },
   
}

    // ****COMPONENT C ****** 
var ComponentC = {
    props: ['todos'],
    components: {
        'component-d':ComponentD
    },
    data: function ()
    {
        return {
            newTodoItem: '',
            newCompleted: false,
            singleTodoId: null,
            todoItems: [],
            header:'',
        }
    },
    template: `<div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title todo-heading" :todos="todos">
                                <a @click="$router.go(-1)">
                                    <i class="fa fa-arrow-left"></i>
                                </a>
                                {{this.header.todoTitle}}
                            <div class="btn-group mt-lg-1 mr-1" style="float:right;">
                                    <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Filter
                                    </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" @click="filterAll">All</a>
                                    <a class="dropdown-item" @click="filterDone">Done</a>
                                    <a class="dropdown-item" @click="filterNotDone">Not Done</a>
                                </div>
                            </div>
                        </div>
                            <component-d v-for="todoItem in todoItems" :key="todoItem.id" :todo-items="todoItem" ></component-d>
                            <div class="col align-items-center"
                            <form class="add-todo-item">
                                <input  type="text" placeholder="Add new Todo Item" v-model="newTodoItem">
                                <button type="button" class="btn btn-primary" @click="addTodoItems(newTodoItem)">Add Task</button>
                            </form>
                            </div>  
                        </div>
                    </div>
                </div>`,
            methods: {
                addTodoItems(newTodoItem)
                {
                    if (!newTodoItem)
                    {
                        alert("Please Insert a Todo Item")
                    }
                    
                    else {
                        axios
                        .post(`http://localhost:3000/todos/${this.singleTodoId}/todoItems`,{
                            itemTitle: newTodoItem,
                            todoId : this.singleTodoId,
                            completed: false
                      })
                      .then(res => this.todoItems = res.data)
                      .catch(err => console.error(err));
                    } 
                },
                filterAll()
                {
                    axios
                    .get(`http://localhost:3000/todos/${this.singleTodoId}/todoItems`)
                    .then(res => this.todoItems= res.data)
                        .catch(err => console.error(err));
                },
                filterDone()
                {
                    this.todoItems = this.todoItems.filter((t) => t.completed == true)
                    
                },
                filterNotDone()
                {
                    this.todoItems = this.todoItems.filter((t) => t.completed == false)
                }
    },   
            mounted() {
                this.singleTodoId = this.$route.params.id;
                 axios
                    .get(`http://localhost:3000/todos/${this.singleTodoId}/todoItems`)
                    .then(res => this.todoItems= res.data)
                    .catch(err => console.error(err));

                    axios
                    .get(`http://localhost:3000/todos/${this.singleTodoId}`)
                    .then(res => this.header= res.data)
                    .catch(err => console.error(err));
    },
            
}


// ROUTER********
const routes = [
    { path: '/', component: ComponentA },
    { path: '/:id/todoitem', component: ComponentC}
]
const router = new VueRouter({
    routes,
  })
new Vue({

    
    el: "#app",
    components: {
        'component-a': ComponentA,
        'component-b': ComponentB,
        'component-c': ComponentC,
        'component-d': ComponentD
    },
    router,
    data: {
            todos: [],
            headertitle: "To do lists",
        
    },
    mounted() {
        axios
          .get("http://localhost:3000/todos")
          .then(res => this.todos = res.data )
            .catch(err => console.error(err));     
    },
    
});
