/*-------------------------------------------------------------------------------------------
Thanks to Erik Kay and Mike Belshe from the Google Chrome engineering team who originally
wrote the below sorting test. This test is a great way to experience the patterns across
javascript timer resolutions and CPU efficency. Plus it's fun to visualize algorithms
and think back to Computer Science class. Thanks guys!
We made a few minor changes to showcase the proposed setImmediate API benefits.
   1) Run test in HTML5 Standards mode instead of Quirks mode.
   2) Added CSS unit descriptors for CSS compliance (and to eliminate error codepaths).
   3) Refactored callbacks to a single location to simplify learning about setImmediate.
   4) Added concept of setImmedate to the callbacks.
   5) Only run one test at a time which removes observer effect from second test.
   6) Use CSS3 transforms which removes layout/formatting observer effect.
   7) Implemeneted three hard coded tests for simplicity rather than dynamic values.
   8) Randomly generate during page load and then reuse the same array for all three tests.
   9) Changed the color scheme and styles of the test to match the IE TestDrive theme.
----------------------------------------------------------------------------------------------*/

// Sort Object

var sort;
var manual = 0;
var size = 250;
var query = window.location.search.substring(1);
var params = query.split('&');
for (var i = 0; i < params.length; i++) {
    var pos = params[i].indexOf('=');
    var key = params[i].substring(0, pos);
    var val = params[i].substring(pos + 1);
    if (key == "size") {
        var sz = parseInt(val);
        size = Math.max(sz, 3);
        size = Math.min(1000, size);
    }
}

var log;
function log(msg) {
    if (window.console != undefined) {
        window.console.log(msg);
    }
}

function Sort(name, interval_time, func) {
    this.name = name;
    this.func = func;
    this.results;
    this.powerConsumption;
    this.CPUEfficency;
    this.size = size;
    this.compare_x = null;
    this.compare_y = null;
    this.compares = 0;
    this.swap_x = null;
    this.swap_y = null;
    this.swaps = 0;
    this.start_time = 0;
    this.stop_time = 0;
    this.work_queue = new Array();
    this.timer = 0;
    this.last_time = 0;
    this.num_iterations = 0;
    this.num_jobs = 0;
    this.overhead_total = 0;
    this.overhead_min = 1000000;
    this.overhead_max = 0;
    this.processing_total = 0;
    this.processing_min = 1000000;
    this.processing_max = 0;
    this.step_min = 1000000;
    this.step_max = 0;
    this.interval_time = interval_time;

    this.setup();
}

Sort.prototype.setup = function () {
    this.size = size;
    this.bars = new Array(this.size);
    for (i = 0; i < this.size; i++) {
        this.bars[i] = { elem: "", value: i + 1, left: "" };
    }
    for (i = 0; i < this.size; i++) {
        var r = Math.floor(Math.random() * this.bars.length);
        if (i != r) {
            var tmp = this.bars[i].value;
            this.bars[i].value = this.bars[r].value;
            this.bars[r].value = tmp;
        }
    }

    this.barsOriginal = this.bars.slice(0);
}

Sort.prototype.stepper = function () {
    var t = new Date();
    var overhead = t - this.last_time;
    this.overhead_total += overhead;
    this.overhead_min = Math.min(this.overhead_min, overhead);
    this.overhead_max = Math.max(this.overhead_max, overhead);
    this.last_time = t;

    var elapsed = t - this.start_time;
    var avg = Math.floor((elapsed - this.processing_total) / this.num_iterations);

    var ops = 0;
    var count = this.work_queue.length;
    if (count > 0) {
        var func = this.work_queue.pop();
        ops++;
        this.num_jobs++;
        func();
    }

    t = new Date();

    var processing = t - this.last_time;
    this.processing_min = Math.min(this.processing_min, processing);
    this.processing_max = Math.max(this.processing_max, processing);
    this.processing_total += processing;
    var step_time = processing + overhead;
    this.step_min = Math.min(this.step_min, step_time);
    this.step_max = Math.max(this.processing_max, step_time);
    this.num_iterations++;
    this.last_time = new Date();

    if (ops == 0) {
        this.finished();
    }
    else {
        this.registerCallback();
    }
}

Sort.prototype.add_work = function (work, name) {
    this.work_queue.push(work);
}

Sort.prototype.init = function () {
    this.print();
}

Sort.prototype.reset = function () {
    this.stop();
    this.start_time = 0;
    this.stop_time = 0;
    this.bars = this.barsOriginal.slice(0);
    this.print();
}

Sort.prototype.startSetTimeout15 = function () {
    this.useSetImmediate = false;
    this.interval_time = 15;
    this.results = document.getElementById("HTML4TestResuts");
    this.powerConsumption = "<span style='color:green;'>Standard</span>";
    this.CPUEfficency = "<span style='color:red;'>Low</span>";
    this.reset();
    this.start();
}

Sort.prototype.startSetTimeout0 = function () {
    this.useSetImmediate = false;
    this.interval_time = 4;
    this.results = document.getElementById("HTML5TestResults");
    this.powerConsumption = "<span style='color:red;'>High</span>";
    this.CPUEfficency = "<span style='color:orange;'>Medium</span>";
    this.reset();
    this.start();
}

Sort.prototype.startSetImmediate = function () {
    this.useSetImmediate = true;
    this.interval_time = 4;
    this.results = document.getElementById("setImmediateTestResults");
    this.powerConsumption = "<span style='color:green;'>Low</span>";
    this.CPUEfficency = "<span style='color:green;'>High</span>";
    this.reset();

    if (browserSupportsSetImmediate == false){
        document.getElementById("setImmediateTestButton").disabled = true;
        document.getElementById("setImmediateTestResults").innerHTML = "<span'>Your browser does not currently support the setImmediate API, an emerging specification in the <a href='http://www.w3.org/2010/webperf/'>W3C Web Performance Working Group</a>.</span>";
    }
    else{
        this.start();
    }

}

Sort.prototype.start = function () {
    if (this.start_time > 0) {
        if (this.stop_time > 0) {
            this.start_time = 0;
            this.stop_time = 0;
            return;
        } else if (manual) {
            this.stepper();
            return;
        } else {
            this.finished();
            return;
        }
    }
    if (!manual) {
        this.registerCallback();
    }
    this.compares = 0;
    this.swaps = 0;
    this.start_time = (new Date()).getTime();
    this.last_time = this.start_time;
    this.num_jobs = 0;
    this.stop_time = 0;
    this.overhead_total = 0;
    this.overhead_min = 1000000;
    this.overhead_max = 0;
    this.processing_total = 0;
    this.processing_min = 1000000;
    this.processing_max = 0;
    this.num_iterations = 0;
    this.func(this);
}

Sort.prototype.registerCallback = function () {
    var t = this;

    if (this.useSetImmediate) {
        if (window.setImmediate)
        {
            this.timer = setImmediate(function () { t.stepper(); });
        }
        else if (window.msSetImmediate)
        {
            this.timer = msSetImmediate(function () { t.stepper(); });
        }
        else if (window.MozSetImmediate)
        {
            this.timer = MozSetImmediate(function () { t.stepper(); });
        }
        else if (window.WebkitSetImmediate) {
            this.timer = WebkitSetImmediate(function () { t.stepper(); });
        }
        else if (window.OSetImmediate)
        {
            this.timer = OSetImmediate(function () { t.stepper(); });
        }
    }
    else {
        this.timer = setTimeout(function () { t.stepper(); }, this.interval_time);
    }
}

Sort.prototype.cleanup = function () {
    if (this.compare_x) {
        this.compare_x.elem.style.borderColor = "black";
        this.compare_y.elem.style.borderColor = "black";
    }
    if (this.swap_x) {
        this.swap_x.elem.style.backgroundColor = "green";
        this.swap_y.elem.style.backgroundColor = "green";
    }
    this.work_queue = new Array();
}

Sort.prototype.stop = function () {
    if (this.timer != 0) {
        this.timer = 0;
    }
    this.cleanup();
}

Sort.prototype.finished = function (err) {
    this.stop();

    this.stop_time = (new Date()).getTime();

    var total = (this.stop_time - this.start_time);
    if (err == null) {
        var step_avg = Math.floor(total / this.num_iterations);
        var overhead = total - this.processing_total;
        var overhead_avg = Math.floor(overhead / this.num_iterations);
        var processing_avg = Math.floor(this.processing_total / this.num_iterations);
        this.results.innerHTML = "Time Required: " + total + "ms" + "<br/>" + "Power Consumption: " + this.powerConsumption + "<br/>" + "CPU Efficency: " + this.CPUEfficency;
    }
}

Sort.prototype.shuffle = function () {
    for (i = 0; i < this.size; i++) {
        var r = Math.floor(Math.random() * this.size);
        if (i != r) {
            this.swap(i, r);
        }
    }
    this.cleanup();
}

Sort.prototype.print = function () {
    var graph = document.getElementById(this.name);
    if (graph == undefined) {
        alert("can't find " + this.name);
    }
    var text = "";
    var len = this.bars.length;
    var height_multiple = (graph.clientHeight - 20) / len;
    var width = 3;
    var left_offset = Math.round((graph.clientWidth - ((width + 1) * len)) / 2);
    for (i = 0; i < len; i++) {
        var val = this.bars[i].value;
        var height = Math.max(1, Math.floor(val * height_multiple));
        var left = left_offset + (i * (width + 1));
        this.bars[i].left = left;
        text += "<div class='bar' style='border: 1px solid black; height:" + height + "px; width:" + width + "px; " + browserTransformCSS + ":translate(" + left + "px, 0px);'" + " id='" + this.name + val + "' value='" + val + "'></div>";
    }

    graph.innerHTML = text;
    var nodes = document.getElementsByClassName("bar");
    var j = 0;
    for (i = 0; i < nodes.length; i++) {
        var name = nodes[i].id;
        if (name.indexOf(this.name) == 0) {
            this.bars[j].elem = nodes[i];
            j++;
        }
    }
}

Sort.prototype.compare = function (x, y) {
    var bx = this.bars[x];
    var by = this.bars[y];
    if (this.compare_x != bx) {
        this.compare_x = bx;
    }
    if (this.compare_y != by) {
        this.compare_y = by;
    }
    this.compares++;
    return bx.value - by.value;
}

Sort.prototype.swap = function (x, y) {
    var bx = this.bars[x];
    var by = this.bars[y];
    if (this.swap_x != x) {
        if (this.swap_x) {
            this.swap_x.elem.style.backgroundColor = "green";
        }
        bx.elem.style.backgroundColor = "blue";
        this.swap_x = bx;
    }
    if (this.swap_y != y) {
        if (this.swap_y) {
            this.swap_y.elem.style.backgroundColor = "green";
        }
        by.elem.style.backgroundColor = "red";
        this.swap_y = by;
    }

    var tmp = bx.left;
    bx.left = by.left;
    by.left = tmp;

    bx.elem.style[browserTransformDOM] = 'translate(' + bx.left + 'px, ' + 0 + 'px)';
    by.elem.style[browserTransformDOM] = 'translate(' + by.left + 'px, ' + 0 + 'px)';

    this.bars[x] = by;
    this.bars[y] = bx;

    this.swaps++;
}



// QuickSort Implementation

function sort_quick(sort, left, right) {
    if (arguments.length == 1) {
        left = 0;
        right = sort.size - 1;
    }
    if (left < right) {
        var pivot = left + Math.floor(Math.random() * (right - left));
        partition(sort, left, right, pivot);
    }
}

function partition(sort, left, right, pivot) {
    sort.swap(pivot, right);
    sort.add_work(function () { partition_step(sort, left, right, pivot, left, left); });
}

function partition_step(sort, left, right, pivot, i, j) {
    if (i < right) {
        if (sort.compare(i, right) <= 0) {
            sort.swap(i, j);
            j++;
        }
        i++;
        sort.add_work(function () { partition_step(sort, left, right, pivot, i, j) });
    } else {
        sort.swap(j, right);
        sort.add_work(function () { sort_quick(sort, left, j - 1) });
        sort.add_work(function () { sort_quick(sort, j + 1, right) });
    }
}



// Simple User Agent Detection

var UA = navigator.userAgent.toLowerCase();
var index, browserCheck, browserName, browserVersion, browserTransformDOM, browserTransformCSS, browserSupportsSetImmediate;

function GetBrowser() {
    if (UA.indexOf('msie') > -1) {
        index = UA.indexOf('msie');
        browserCheck = "IE";
        browserName = "Internet Explorer";
        browserVersion = "" + parseFloat('' + UA.substring(index + 5));
        browserTransformDOM = "msTransform";
        browserTransformCSS = "-ms-transform";
        browserSupportsSetImmediate = (window.msSetImmediate) ? true : false;
    }
    else if (UA.indexOf('chrome') > -1) {
        index = UA.indexOf('chrome');
        browserCheck = "Chrome";
        browserName = "Google Chrome";
        browserVersion = "" + parseFloat('' + UA.substring(index + 7));
        browserTransformDOM = "WebkitTransform";
        browserTransformCSS = "-webkit-transform";
        browserSupportsSetImmediate = (window.WebkitSetImmediate) ? true : false;
    }
    else if (UA.indexOf('firefox') > -1) {
        index = UA.indexOf('firefox');
        browserCheck = "Firefox";
        browserName = "Mozilla Firefox";
        browserVersion = "" + parseFloat('' + UA.substring(index + 8));
        browserTransformDOM = "MozTransform";
        browserTransformCSS = "-moz-transform";
        browserSupportsSetImmediate = (window.MozSetImmediate) ? true : false;
    }
    else if (UA.indexOf('minefield') > -1) {
        index = UA.indexOf('minefield');
        browserCheck = "Firefox";
        browserName = "Mozilla Firefox Minefield";
        browserVersion = "" + parseFloat('' + UA.substring(index + 10));
        browserTransformDOM = "MozTransform";
        browserTransformCSS = "-moz-transform";
        browserSupportsSetImmediate = (window.MozSetImmediate) ? true : false;
    }
    else if (UA.indexOf('opera') > -1) {
        browserCheck = "Opera";
        browserName = "Opera";
        browserVersion = "";
        browserTransformDOM = "OTransform";
        browserTransformCSS = "-o-transform";
        browserSupportsSetImmediate = (window.OSetImmediate) ? true : false;
    }
    else if (UA.indexOf('safari') > -1) {
        index = UA.indexOf('safari');
        browserCheck = "Safari";
        browserName = "Apple Safari";
        browserVersion = "" + parseFloat('' + UA.substring(index + 7));
        browserTransformDOM = "WebkitTransform";
        browserTransformCSS = "-webkit-transform";
        browserSupportsSetImmediate = (window.WebkitSetImmediate) ? true : false;
    }

    if (!browserSupportsSetImmediate && window.setImmediate) {
        browserSupportsSetImmediate = true;
    }
}



// Test Infrastructure

function InitializePage() {

    GetBrowser();

    sort = new Sort("TestGraph", 0, sort_quick);
    sort.init();

}
