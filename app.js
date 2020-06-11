
var ComponentA = {
    props: ['headertitle', 'todos'],
    template:`<div class="card">
    <div class="card-body">
        <h4 class="card-title" >
            {{headertitle}}<button type="button" class="btn" data-target="#addtodoModal" data-toggle="collapse"><span class="fa fa-plus fa-xs"></span></button></h4>       
    </div> 
    <div class="collapse" id="addtodoModal">
    </div>
</div>`
}
var ComponentB = {
    components: {
        'component-a': ComponentB
      },
    props:['todos'],
    template:`<div class="todoitems">
                <li class="list-group-item" >
                    <a type="button" href="#">{{todos.todoTitle}}</a>
                    <button type="button" class="btn"><i class="fa fa-trash"></i></button>
                </li>   
            </div>`
    
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
    },
    mounted() {
        axios
          .get("http://localhost:3000/todos")
          .then(res => this.todos = res.data )
            .catch(err => console.error(err));
        
    },
   
   
});