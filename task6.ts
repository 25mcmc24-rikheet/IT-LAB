enum State {
    Open,
    Done
}

class Task {
    id: number;
    title: string;
    due: Date;
    state: State;

    constructor(id: number, title: string, due: Date) {
        this.id = id;
        this.title = title;
        this.due = due;
        this.state = State.Open;
    }

    complete(): void {
        this.state = State.Done;
    }
}

class TaskStore {
    private list: Task[] = [];

    add(title: string, date: string): void {
        const task = new Task(Date.now(), title, new Date(date));
        this.list.push(task);
        this.list.sort((a, b) => a.due.getTime() - b.due.getTime());
    }

    remove(id: number): void {
        this.list = this.list.filter(t => t.id !== id);
    }

    finish(id: number): void {
        const task = this.list.find(t => t.id === id);
        if (task) task.complete();
    }

    get(filter: "all" | "open" | "done"): Task[] {
        if (filter === "open") return this.list.filter(t => t.state === State.Open);
        if (filter === "done") return this.list.filter(t => t.state === State.Done);
        return this.list;
    }
}

const store = new TaskStore();

const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const dateInput = document.getElementById("dateInput") as HTMLInputElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

let activeFilter: "all" | "open" | "done" = "all";

function render(): void {
    taskList.innerHTML = "";

    store.get(activeFilter).forEach(task => {
        const li = document.createElement("li");
        const span = document.createElement("span");

        span.innerText = `${task.due.toDateString()} - ${task.title}`;
        if (task.state === State.Done) span.classList.add("done");

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

function addTask(): void {
    if (!taskInput.value || !dateInput.value) return;

    store.add(taskInput.value, dateInput.value);
    taskInput.value = "";
    dateInput.value = "";
    render();
}

function setFilter(f: "all" | "open" | "done"): void {
    activeFilter = f;
    render();
}