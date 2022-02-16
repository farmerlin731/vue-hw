import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

        createApp({
            data() {
                return {
                    url: 'https://vue3-course-api.hexschool.io/v2',// 請加入站點
                    path: 'farmerlin731',// 請加入個人 API Path
                    user: {
                        username: '',
                        password: '',
                    },
                }
            },
            methods: {
                login() {
                    axios.post(`${this.url}/admin/signin`, this.user)
                        .then((res) => {
                            const { token, expired } = res.data
                            document.cookie = `hexFarmerToken=${token}; expires=${new Date(expired)};`;
                            window.location = "backside.html";
                        })
                        .catch((err) => {
                            console.dir(err);
                            alert(`${err.data.message}`);
                        });
                },
                checkToken() {
                    // check login token
                    var token = document.cookie.replace(/(?:(?:^|.*;\s*)hexFarmerToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                    axios.defaults.headers.common['Authorization'] = token;
                    axios.post(`${this.url}/api/user/check`)
                        .then((res) => {
                            alert('帳號已登入，將自動導向產品頁面。');
                            window.location = "backside.html";
                        })
                        .catch((err) => {
                            console.dir(err);
                        });
                }
            },
            mounted() {
                this.checkToken();
            }
        }).mount('#app');