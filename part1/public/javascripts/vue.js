const vueinst = Vue.createApp({
    data() {
        return {
            img_src: ""
        };
    },
    methods: {
        getDog() {
            fetch('https://dog.ceo/api/breeds/image/random', {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => {
                img_src = data.message
            });
        }
    },
    mounted() {

    }
}).mount('body');

window.vueinst = vueinst;