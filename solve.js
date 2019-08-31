class SanArray {
	constructor(str,parent) {
		this.array = [];
		this.separators = [];
		let subArray = false;
		let parentheses = 0;
		let separator = false;
		let dropper = false;
		let marker = 0;
		this.layer = 0;
		if(!parent) {
			this.parent = null;
		} else {
			this.parent = parent;
		}
		str = str.substring(2, str.length - 1); 
		for(let i = 0; i < str.length; i++) {
			if(subArray) {
				if(str[i] === "(") {
					parentheses++;
				}
				if(str[i] === ")") {
					parentheses--;
				}
				if(parentheses === 0) {
					subArray = false;
				}
				if(str[i] === ",") {
					str = str.replace(",","c");
				}if(str[i] === "{") {
					str = str.replace("{","b");
				}
				if(str[i] === "}") {
					str = str.replace("}","d");
				}
			} else if(separator) {
				if(str[i] === "{") {
					parentheses++;
				}
				if(str[i] === "}") {
					parentheses--;
				}
				if(parentheses === 0) {
					separator = false;
					let sep = str.substring(marker,i+1);
					this.separators.push(new Separator(sep,this));
					str = str.replace(sep," ");
					i = marker;
				}
			} else {
				if(str[i] === ",") {
					str = str.replace(","," ");
					this.separators.push(new Separator(",",this));
				}
				if(str[i-1] === "s" && str[i] === "(") {
					subArray = true;
					parentheses++;
				}
				if(str[i] === "{") {
					separator = true;
					parentheses++;
					marker = i;
				}
			}
		}
		str = str.replace(/c/g,",");
		str = str.replace(/b/g,"{");
		str = str.replace(/d/g,"}");
		let array = str.split(" ");
		for(let i = 0; i < array.length; i++) {
			if(array[i][0] === "s") {
				array[i] = new SanArray(array[i],this);
			} else {
				array[i] = parseInt(array[i]);
			}
		}
		this.array = array;
		this.base = this.array.shift();
		this.iterator = this.array.shift();
		this.separators.shift();
	}
	clean() {
		while(this.array[this.array.length-1] === 1 && this.array.length > 0) {
			this.array.pop();
			this.separators.pop();
		}
		for(let i = this.separators.length-1; i >= 1; i--) {
			while(this.array[i-1] <= 1 && this.array[i] > 1 && Separator.level(this.separators[i],this.separators[i-1]) === this.separators[i]) {
				this.array.splice(i-1,1);
				this.separators.splice(i-1,1);
				i--;
			}
		}
		for(let i = 0; i < this.separators.length; i++) {
			this.separators[i].clean();
		}
	}
}
