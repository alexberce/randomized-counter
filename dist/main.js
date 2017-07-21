var RandomizedCounter = (function () {
    function RandomizedCounter(config) {
        this.config = config;
        this.updateInterval = ~~this.config['updateInterval'] || 1000;
        this.updateChance = ~~this.config['updateChance'] >= 0 && ~~this.config['updateChance'] <= 100
            ? ~~this.config['updateChance']
            : 100;
    }
    RandomizedCounter.prototype.loadCounterData = function () {
        return (function (self) {
            return $.getJSON(self.config['jsonFileLocation'], function (json) {
                self.counterData = json;
            }).promise();
        })(this);
    };
    RandomizedCounter.prototype.run = function () {
        (function (self) {
            self.loadCounterData()
                .then(function () {
                self.startCounter();
            });
        })(this);
    };
    RandomizedCounter.prototype.startCounter = function () {
        this.updateCounter();
        this.bindCounterEvent();
    };
    RandomizedCounter.prototype.bindCounterEvent = function () {
        (function (self) {
            setInterval(function () {
                self.updateCounter();
            }, self.updateInterval);
        })(this);
    };
    RandomizedCounter.prototype.updateCounter = function () {
        if (this.shouldUpdateCounter()) {
            $('#' + this.config['counterElementId']).html(RandomizedCounter.formatNumber(this.counterData['numberForTimestamp'][RandomizedCounter.getCounterJsonKey()]));
        }
    };
    RandomizedCounter.prototype.shouldUpdateCounter = function () {
        return ~~(Math.random() * 100) <= this.updateChance;
    };
    RandomizedCounter.formatNumber = function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    RandomizedCounter.getCounterJsonKey = function () {
        function fix2(n) {
            return (n < 10) ? '0' + n : n;
        }
        var date = new Date();
        return String(fix2(date.getUTCFullYear())) +
            String(fix2(date.getUTCMonth() + 1)) +
            String(fix2(date.getUTCDate())) +
            String(fix2(date.getUTCHours())) +
            String(fix2(date.getUTCMinutes())) +
            String(fix2(date.getUTCSeconds()));
    };
    return RandomizedCounter;
}());
