class RandomizedCounter {
	
	private config: RandomizedCounterConfig;
	
	private counterData: Array<any>;
	
	private updateInterval: number;
	
	private updateChance: number;
	
	constructor(config: RandomizedCounterConfig) {
		this.config = config;
		
		this.updateInterval = ~~this.config['updateInterval'] || 1000;
		
		this.updateChance = ~~this.config['updateChance'] >= 0 && ~~this.config['updateChance'] <= 100
			? ~~this.config['updateChance']
			: 100;
	}
	
	private loadCounterData(): JQueryPromise<any> {
		return (function (self) {
			return $.getJSON(self.config['jsonFileLocation'], function (json) {
				self.counterData = json;
			}).promise();
		})(this);
	}
	
	public run(): void {
		(function (self) {
			self.loadCounterData()
				.then(function () {
					self.startCounter();
				});
		})(this);
	}
	
	private startCounter() {
		this.updateCounter();
		this.bindCounterEvent();
	}
	
	private bindCounterEvent() {
		(function (self) {
			setInterval(function () {
				self.updateCounter();
			}, self.updateInterval);
		})(this);
	}
	
	private updateCounter() {
		if(this.shouldUpdateCounter()){
			$('#' + this.config['counterElementId']).html(
				RandomizedCounter.formatNumber(
					this.counterData['numberForTimestamp'][RandomizedCounter.getCounterJsonKey()]
				)
			
			);
		}
	}
	
	private shouldUpdateCounter(){
		return ~~(Math.random() * 100) <= this.updateChance;
	}
	
	/**
	 * @param {number} number
	 * @returns {string}
	 */
	private static formatNumber(number: number): string {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	/**
	 * @returns {string}
	 */
	private static getCounterJsonKey(): string{
		function fix2(n) {
			return (n < 10) ? '0' + n : n;
		}
		
		let date = new Date();
		
		return String(fix2(date.getUTCFullYear())) +
			String(fix2(date.getUTCMonth() + 1)) +
			String(fix2(date.getUTCDate())) +
			String(fix2(date.getUTCHours())) +
			String(fix2(date.getUTCMinutes())) +
			String(fix2(date.getUTCSeconds()));
	}
}