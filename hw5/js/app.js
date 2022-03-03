import prodModal from "./prodModal.js";


Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


const app = Vue.createApp({
    data() {
        return {
            tmpData: 'hihivue0226',
            url: 'https://vue3-course-api.hexschool.io/v2',// 請加入站點
            path: 'farmerlin731',// 請加入個人 API Path
            products: [], // PROD LIST
            cartData: {},
            tmpProd: {},
            loadingItemId: '',
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
              },

            // fakeCartData: {
            //     "carts": [
            //         {
            //             "coupon": {
            //                 "code": "testCode",
            //                 "due_date": 6547658,
            //                 "id": "-L9uIs5EfPibJpwwTMhN",
            //                 "is_enabled": 1,
            //                 "percent": 60,
            //                 "title": "超級特惠價格"
            //             },
            //             "final_total": 2160,
            //             "id": "-LATwxc_bIJu-AR4AlNj",
            //             "product": {
            //                 "category": "衣服3",
            //                 "content": "這是內容",
            //                 "description": "Sit down please 名設計師設計",
            //                 "id": "-L9tH8jxVb2Ka_DYPwng",
            //                 "imageUrl": "主圖網址",
            //                 "imagesUrl": [
            //                     "圖片網址一",
            //                     "圖片網址二",
            //                     "圖片網址三",
            //                     "圖片網址四",
            //                     "圖片網址五"
            //                 ],
            //                 "is_enabled": 1,
            //                 "num": 1,
            //                 "origin_price": 500,
            //                 "price": 600,
            //                 "title": "[賣]動物園造型衣服3",
            //                 "unit": "個"
            //             },
            //             "product_id": "-L9tH8jxVb2Ka_DYPwng",
            //             "qty": 6,
            //             "total": 3600
            //         }
            //     ],
            //     "total": 3600,
            //     "final_total": 2160
            // },

        }
    },
    methods: {
        testFunc() {
            alert('Form Submit.');
            this.$refs.form.resetForm();
        },
        btnShowMore(item) {
            this.tmpProd = item;
            this.$refs.proModal.openModal();
        },
        btnAddToCart(item, quantity = 1) {
            this.$refs.proModal.hideModal();
            this.loadingItemId = item.id;

            let tmpCart = {
                product_id: item.id,
                qty: quantity,
            };

            axios.post(`${this.url}/api/${this.path}/cart`, { data: tmpCart })
                .then((res) => {
                    this.getCart();
                    this.loadingItemId = '';
                })
                .catch((err) => {
                    console.dir(err);
                    this.loadingItemId = '';
                })

        },

        updateCart(item) {
            let tmpCart = {
                product_id: item.id,
                qty: item.qty,
            };
            this.loadingItemId = item.id;
            axios.put(`${this.url}/api/${this.path}/cart/${item.id}`, { data: tmpCart })
                .then((res) => {
                    this.getCart();
                    this.loadingItemId = '';

                })
                .catch((err) => {
                    console.dir(err);
                    this.loadingItemId = '';
                })
        },

        deleteCart(item) {
            this.loadingItemId = item.id;
            axios.delete(`${this.url}/api/${this.path}/cart/${item.id}`)
                .then((res) => {
                    this.loadingItemId = '';
                    this.getCart();
                })
                .catch((err) => {
                    console.dir(err);
                    this.loadingItemId = '';
                })
        },

        deleteCartAll() {
            axios.delete(`${this.url}/api/${this.path}/carts`)
                .then((res) => {
                    alert('cart - deleteAll success.');
                    this.getCart();
                })
                .catch((err) => {
                    console.dir(err);
                    alert('cart - deleteAll failure.');
                })
        },
        submitOrder(){
            const order = this.form;
            axios.post(`${this.url}/api/${this.path}/order`, { data: order })
            .then((response) => {
              alert(response.data.message);
              this.$refs.form.resetForm();
              this.form.message='';
              this.getCart();
            }).catch((err) => {
              alert(err.data.message);
            });
        },
        getOrders(){
            console.log('get order!');
            axios.get(`${this.url}/api/${this.path}/orders`)
            .then((response) => {
              console.log(response);
            }).catch((err) => {
              alert(err.data.message);
            });
        },
        getData() {
            axios.get(`${this.url}/api/${this.path}/products/all`)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.dir(err);
                    alert('擷取失敗。 ');
                });
        },
        getCart() {
            axios.get(`${this.url}/api/${this.path}/cart`)
                .then((res) => {
                    this.cartData = res.data.data;
                })
                .catch((err) => {
                    alert('CART ERROR');
                })
        },
    },
    mounted() {
        this.getData();
        this.getCart();
        //this.getOrders(); //for test
    }
});

app.component('pro-modal', prodModal);

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


app.mount('#app');
