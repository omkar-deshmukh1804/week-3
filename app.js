var ComponentB = {
    props:['todos'],
    template:`<div class="todoitems">
                    <li class="list-group-item" >
                        <a href="#">{{todos.todoTitle}}</a>
                        <button type="button" class="btn" @click="deleteTodo(todos.id)">
                            <i class="fa fa-trash" ></i>
                        </button>
                    </li>
            </div>`,
    methods: {
        deleteTodo (id) {
            // this.todos = this.todos.filter(todo => todo.id !== id);
            axios
              .delete(`http://localhost:3000/todos/${id}`)
              .then(res => this.todos=res.data)
              .catch(err => console.error(err));
        }
    },
    
}

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
    
    template:`<div class="card">
                <div class="card-body">
                    <h4 class="card-title" >
                        {{headertitle}}<button type="button" class="btn" @click="toggleAdd" ><span class="fa fa-plus fa-xs"></span>
                        </button>
                    </h4>       
                    <form v-show="showAddNewTodo" @submit="">
                        <input type= "text" placeholder="Add new todo"  v-model="newTodoTitle">
                        <button type="submit" class="btn btn-warning btn-sm" @click="addTodos(newTodoTitle)" >Add Todo</button>
                    </form>
                        <component-b v-for="todo in todos" :key="todo.id" :todos="todo"></component-b>
                </div>
</div>`,
    
    methods: {
        toggleAdd() {
            this.showAddNewTodo = !this.showAddNewTodo;
        },
        addTodos(newTodoTitle)
        {
            axios
                .post('http://localhost:3000/todos',{
                  todoTitle : newTodoTitle
              })
              .then(res => this.todos=res.data)
              .catch(err => console.error(err));
        }
        
    },
}




new Vue({
    
    el: "#app",
    components: {
        'component-a': ComponentA,
        'component-b': ComponentB
      },
    data: {
        
            todos: [],
            headertitle: "To do lists",
            showAddNewTodo : false,
        
        
    },
    mounted() {
        axios
          .get("http://localhost:3000/todos")
          .then(res => this.todos = res.data )
            .catch(err => console.error(err));
        
    },
    methods: {
       
       
    },
   
   
});