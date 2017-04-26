var animalKingdom = animalKingdom || {};

animalKingdom.marsupial = function(name, nocturnal) {
    var name = name,
        noctural = nocturnal;

    return {
        getName: function () {
            return name;
        },
        getNoctural: function () {
            return noctural;
        }
    }
}

animalKingdom.monkey = function(name, nocturnal) {
    var instance = animalKingdom.marsupial(name, nocturnal);

    instance.shout = function() {
        console.log("My name is " + name);
    };

    return instance;
}

var bonobo = animalKingdom.monkey("bonobo", true);

console.log(bonobo);
console.log(bonobo.getName())
console.log(bonobo.getNoctural());
bonobo.shout();

