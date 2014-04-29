var POLYTHREE = {
    bindConstructor: function(constructor, args) {
        var factoryFunc = constructor.bind.apply(constructor, [null].concat(args));
        return new factoryFunc();
    },
    convert: function(targetValue, value) {
        if(value.slice(0,2) === "0x") {
            return parseInt(value.slice(2), 16);   
        }
        switch(typeof targetValue) {
            case "number": 
                value = parseFloat(value);
                break;
            case "boolean":
                value = value === "true";
                break;  
        }
        
        return value;
    },
    attribChanged: function(target, name, old, newVal) {
        if(target.hasOwnProperty("needsUpdate")) {
           target.needsUpdate = true; 
        }
        
        target[name] = POLYTHREE.convert(target[name], value);
    },
    bindAttrib: function(from, target, name) {
        from[name] && (target[name] = POLYTHREE.convert(target[name], from[name]));
        
        // this won't reflect changes from "from" unless I object.observe it
        from[name+"Changed"] = POLYTHREE.attribChanged.bind(from, target);
    }
};