Module.register("MMM-FastNotes", {
    defaults: {
        host: "127.0.0.1",  // address of host in local network, need for access to WEB UI
        port: "5000",  // port on host where UI will be accessible via web browser
        updateInterval: 10000, // request DB every N miliseconds (10 sec by default)
        pythonPath: 'python3',  // shell command or path to Python 3.6 (or higher) binary
        css: false  // false to use default MM CSS styles
    },

    start: function () {
        //started at module loading
        this.sendSocketNotification("START_FAST_NOTES", this.config);
        this.todoList = [];
        this.startUpdateLoop();
    },

    socketNotificationReceived: function (notification, payload) {
        console.log(notification);
        if (notification === "DATABASE") {
            this.todoList = payload;
        }
    },

    // Gets correct css file from config.js
    getStyles: function () {
        if (this.config.css) {
            return ["modules/MMM-ToDoList/css/custom.css"];
        }
        else {
            return ["modules/MMM-ToDoList/css/default.css"];
        }
    },

    startUpdateLoop: function () {
        setInterval(() => {
            this.updateEvents()
        }, this.config.updateInterval + 2000);
    },

    updateEvents: function () {
        this.updateDom();
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        const tableEl = document.createElement('table');
        wrapper.innerHTML = "";
        if (this.todoList.length > 0) {
            this.todoList.forEach((item) => {
                // name of note
                const rowOne = document.createElement('tr');
                const nameEl = document.createElement('td');
                nameEl.innerText = item.Title;
                nameEl.align = 'left';
                nameEl.className = "xsmall bright";
                rowOne.appendChild(nameEl);
                // content of note
                const rowTwo = document.createElement('tr');
                const textEl = document.createElement('td');
                textEl.innerText = item.Text;
                textEl.align = 'left';
                textEl.className = "small light";
                rowTwo.appendChild(textEl);

                tableEl.appendChild(rowOne);
                tableEl.appendChild(rowTwo);
                wrapper.appendChild(tableEl);
            });
        } else {
            wrapper.innerHTML = "No notes";
        }
        return wrapper;
    }
});