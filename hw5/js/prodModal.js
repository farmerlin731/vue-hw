export default {
    template:'#userProductModal',
    props:['tmpProd'],
    data(){
        return{
            tmpData:'hihiFromData',
            modalDom :{},
            quantity:1,
        }
    },
    methods:{
        openModal(){
            this.quantity = 1;
            this.modalDom.show();
            console.log( ` in component : ${this.tmpProd}`);
        },
        hideModal(){
            this.modalDom.hide();
        }
    },
    mounted(){
        this.modalDom = new bootstrap.Modal(this.$refs.modal, {
            keyboard: false
        });
    },
}