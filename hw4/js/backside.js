import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let prodModal = null;
let delModal = null;



const app = createApp({
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',// 請加入站點
            path: 'farmerlin731',// 請加入個人 API Path
            user: {
                username: '',
                password: '',
            },
            // 全部產品列表
            products: [],
            isNew: false,
            pagination: {},
            tmpProd:
            {
                imagesUrl: [],
            },
            fakeData: {
                "category": "測試分類",
                "content": "測試的newwww0209",
                "description": "測試的描述",
                "id": "-Mtg-jieBP4aNqXVFFOU",
                "imageUrl": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
                "imagesUrl": [
                    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                    "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1948&q=80",
                    "https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
                    "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                ],
                "is_enabled": 1,
                "origin_price": 1000,
                "price": 500,
                "title": "0220_fake_data",
                "unit": "單位",
                "num": 4
            }
        }
    },

    methods: {
        checkToken() {
            // check login token
            var token = document.cookie.replace(/(?:(?:^|.*;\s*)hexFarmerToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            console.log(token);
            axios.post(`${this.url}/api/user/check`)
                .then((res) => {
                    console.log('success login');
                    this.getData();
                })
                .catch((err) => {
                    console.dir(err);
                    alert('驗證失敗，請重新登入。');
                    window.location = "login.html";
                });
        },
        getData(page) {
            if (!page) {page = 1};
            axios.get(`${this.url}/api/${this.path}/admin/products?page=${page}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                    console.log(this.products);
                    console.log(this.pagination);
                    console.log(`now page=${page}`);
                })
                .catch((err) => {
                    console.dir(err);
                    alert('擷取失敗。 ');
                });
        },

        openModal(type, item) {
            // this.tmpProd = item ? { ...item } : { ...this.fakeData };
            this.tmpProd = item ? { imagesUrl: [], ...item } : {imagesUrl: [],};
            if (type == 'add') {
                this.isNew = true;
                prodModal.show();
            } else if (type == 'edit') {
                this.isNew = false;
                prodModal.show();
            } else if (type == 'del') {
                delModal.show();
            }
        },

    },
    mounted() {
        this.checkToken();
    }
});

app.component('prodModalComponent', {
    template: '#prodModalHtml',
    emits: ['update'],
    props: ['tmpProd', 'isNew'],
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',// 請加入站點
            path: 'farmerlin731',// 請加入個人 API Path
        }
    },
    methods: {
        updateProd() {
            let method, tmpUrl, msg;
            if (this.isNew) {
                method = 'post';
                tmpUrl = `${this.url}/api/${this.path}/admin/product`;
                msg = '新增';
            } else {
                method = 'put';
                tmpUrl = `${this.url}/api/${this.path}/admin/product/${this.tmpProd.id}`
                msg = '更新';
            }

            axios[method](tmpUrl, { "data": this.tmpProd })
                .then((res) => {
                    alert(`${msg}資料成功！ :)`);
                    this.$emit('update');
                    prodModal.hide();
                })
                .catch((err) => {
                    console.dir(err);
                    alert(`${msg}資料失敗！ :( \n\n錯誤訊息：\n${err.data.message}`);
                });
        },
        addPicture() {
            this.tmpProd.imagesUrl.push('');
        },

        delPicture(index) {
            this.tmpProd.imagesUrl.splice(index, 1);
        },
    },
    mounted() {
        prodModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
    },
});

app.component('delModalComponent', {
    template: '#delModalHtml',
    emits: ['update'],
    props: ['tmpProd'],
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',// 請加入站點
            path: 'farmerlin731',// 請加入個人 API Path
        }
    },
    methods: {
        delProd() {
            axios.delete(`${this.url}/api/${this.path}/admin/product/${this.tmpProd.id}`)
                .then((res) => {
                    alert('刪除成功！ :)');
                    delModal.hide();
                    this.$emit('update');
                })
                .catch((err) => {
                    alert('刪除失敗！ :(');
                    delModal.hide();
                })

        },
    },
    mounted() {
        delModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
    },
});

app.component('pageComponent', {
    template: '#pagination',
    props: ['pages'],
    data() {
        return {
        }
    },
    methods: {
        emitPages(item) {
            this.$emit('emit-pages', item);
        },
    },});


app.mount('#app');