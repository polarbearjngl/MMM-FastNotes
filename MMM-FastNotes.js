Module.register("MMM-FastNotes", {
    defaults: {
        host: "127.0.0.1",  // address of host in local network, need for access to WEB UI
        port: "5000",  // port on host where UI will be accessible via web browser
        updateInterval: 5000, // request DB every N miliseconds (5 sec by default)
        pythonPath: 'python3',  // shell command or path to Python 3.6 (or higher) binary
        css: 0,  // 0 - current default MM CSS styles; 1 - custom css stile
        // TextStyle could be "xsmall bright" or "medium bright" or another one defined in /home/pi/MagicMirror/css/main.css, or in your own custom CSS
        nameTextStyle: "xsmall bright", // style for Note Name
        contentTextStyle: "normal dimmed", // style for Note Content
        animationSpeed: 2.5 * 1000,  // speed of text fading and changing in 2.5 sec
    },

    start: function () {
        //started at module loading
        this.sendSocketNotification("START_FAST_NOTES", this.config);
        this.todoList = [];
        this.updAnimationSpeed = 0;
        this.startUpdateLoop();
    },

    socketNotificationReceived: function (notification, payload) {
        console.log(notification);
        if (notification === "DATABASE") {
            if (this.todoList != payload) {
                this.todoList = payload;
                this.updAnimationSpeed = this.config.animationSpeed;
            }
            else{
                this.updAnimationSpeed = 0;
            }
        }
    },

    // Gets correct css file from config.js
    getStyles: function () {
        if (this.config.css == 0) {
            return ["modules/MMM-FastNotes/css/default.css"];
        }
        if (this.config.css == 1) {
            return ["modules/MMM-FastNotes/css/custom.css"];
        }
    },

    startUpdateLoop: function () {
        setInterval(() => {
            this.updateEvents()
        }, this.config.updateInterval + 2000);
    },

    updateEvents: function () {
        this.updateDom(this.updAnimationSpeed);
        this.updAnimationSpeed = 0;
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
                nameEl.className = this.config.nameTextStyle;
                rowOne.appendChild(nameEl);
                // content of note
                const rowTwo = document.createElement('tr');
                const textEl = document.createElement('td');
                textEl.innerText = item.Text;
                textEl.align = 'left';
                textEl.className = this.config.contentTextStyle;
                rowTwo.appendChild(textEl);

                tableEl.appendChild(rowOne);
                tableEl.appendChild(rowTwo);
                wrapper.appendChild(tableEl);
            });
        } else {
            wrapper.innerHTML = "No Notes...";
        }
        return wrapper;
    }
});