var State;
(function (State) {
    State[State["Open"] = 0] = "Open";
    State[State["Done"] = 1] = "Done";
})(State || (State = {}));
class Task {
    constructor(id, title, due) {
        this.id = id;
        this.title = title;
        this.due = due;
        this.state = State.Open;
    }
    complete() {
        this.state = State.Done;
    }
}
class TaskStore {
    constructor() {
        this.list = [];
    }
    add(title, date) {
        const task = new Task(Date.now(), title, new Date(date));
        this.list.push(task);
        this.list.sort((a, b) => a.due.getTime() - b.due.getTime());
    }
    remove(id) {
        this.list = this.list.filter(t => t.id !== id);
    }
    finish(id) {
        const task = this.list.find(t => t.id === id);
        if (task)
            task.complete();
    }
    get(filter) {
        if (filter === "open")
            return this.list.filter(t => t.state === State.Open);
        if (filter === "done")
            return this.list.filter(t => t.state === State.Done);
        return this.list;
    }
}
const store = new TaskStore();
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
let activeFilter = "all";
function render() {
    taskList.innerHTML = "";
    store.get(activeFilter).forEach(task => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.innerText = `${task.due.toDateString()} - ${task.title}`;
        if (task.state === State.Done)
            span.classList.add("done");
        const doneBtn = document.createElement("button");
        doneBtn.innerText = "✔";
        doneBtn.onclick = () => {
            store.finish(task.id);
            render();
        };
        const delBtn = document.createElement("button");
        delBtn.innerText = "✖";
        delBtn.onclick = () => {
            store.remove(task.id);
            render();
        };
        li.append(span, doneBtn, delBtn);
        taskList.appendChild(li);
    });
}
function addTask() {
    if (!taskInput.value || !dateInput.value)
        return;
    store.add(taskInput.value, dateInput.value);
    taskInput.value = "";
    dateInput.value = "";
    render();
}
function setFilter(f) {
    activeFilter = f;
    render();
}
