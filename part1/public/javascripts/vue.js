const vueinst = Vue.createApp({
    data() {
        return {
            img_src: "",
            showMenu1: false,
            showMenu2: false,
            showMenu3: false
        };
    },
    methods: {
        getDog() {
            fetch('https://dog.ceo/api/breeds/image/random', {
                method: 'GET'
            })
            .then((res) => res.json())
            .then((data) => {
                this.img_src = data.message;
            });
        }
    },
    mounted() {

    }
}).mount('body');

window.vueinst = vueinst;
