function wtfIsThis () {
    console.log(this);
}

const person = {
    wtfIsThis: () => {
        console.log(this);
    },
    wtfIsThis2: function () {
        console.log(this);
    }
}

wtfIsThis();
person.wtfIsThis();
person.wtfIsThis2();
